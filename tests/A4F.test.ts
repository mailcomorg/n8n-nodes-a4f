import { mockClear, mock } from 'jest-mock-extended';
import { NodeApiError } from 'n8n-workflow';

// استفاده از interface به جای import
interface IExecuteFunctions {
	getNodeParameter(parameterName: string, itemIndex: number, fallbackValue?: any): any;
	getInputData(): any[];
	helpers: {
		requestWithAuthentication(credentialsType: string, requestOptions: any): Promise<any>;
	};
	getNode(): any;
	continueOnFail(): boolean;
}

import { A4F } from '../nodes/A4F/A4F.node';

describe('A4F', () => {
	const nodeInstance = new A4F();
	const mockExecuteFunction = mock<IExecuteFunctions>();

	beforeEach(() => {
		mockClear(mockExecuteFunction);
	});

	describe('chatCompletion', () => {
		it('should make a request to A4F API with correct parameters', async () => {
			// Setup
			const model = 'provider-1/chatgpt-4o-latest';
			const messages = [
				{
					role: 'user',
					content: 'Hello, A4F!',
				},
			];

			const mockResponse = {
				id: 'mock-response-id',
				object: 'chat.completion',
				created: Date.now(),
				model,
				choices: [
					{
						message: {
							role: 'assistant',
							content: 'Hello! How can I assist you today?',
						},
						index: 0,
						finish_reason: 'stop',
					},
				],
				usage: {
					prompt_tokens: 10,
					completion_tokens: 10,
					total_tokens: 20,
				},
			};

			// Mock the necessary methods
			mockExecuteFunction.getNodeParameter.calledWith('operation', 0).mockReturnValue('chatCompletion');
			mockExecuteFunction.getNodeParameter.calledWith('model', 0).mockReturnValue(model);
			mockExecuteFunction.getNodeParameter
				.calledWith('messages.messagesUi', 0, [])
				.mockReturnValue([{ role: 'user', content: 'Hello, A4F!' }]);
			mockExecuteFunction.getNodeParameter.calledWith('additionalFields', 0).mockReturnValue({});

			mockExecuteFunction.getInputData.mockReturnValue([{ json: {} }]);
			mockExecuteFunction.helpers.requestWithAuthentication
				.calledWith('a4fApi', {
					method: 'POST',
					url: 'https://api.a4f.co/v1/chat/completions',
					body: {
						model,
						messages,
					},
					json: true,
				})
				.mockResolvedValue(mockResponse);

			// Execute
			const result = await nodeInstance.execute.call(mockExecuteFunction);

			// Assert
			expect(result).toEqual([[{ json: mockResponse }]]);
			expect(mockExecuteFunction.helpers.requestWithAuthentication).toHaveBeenCalledWith(
				'a4fApi',
				expect.objectContaining({
					method: 'POST',
					url: 'https://api.a4f.co/v1/chat/completions',
					body: expect.objectContaining({
						model,
						messages,
					}),
				}),
			);
		});

		it('should handle errors correctly', async () => {
			// Setup
			mockExecuteFunction.getNodeParameter.calledWith('operation', 0).mockReturnValue('chatCompletion');
			mockExecuteFunction.getNodeParameter.calledWith('model', 0).mockReturnValue('invalid-model');
			mockExecuteFunction.getNodeParameter
				.calledWith('messages.messagesUi', 0, [])
				.mockReturnValue([{ role: 'user', content: 'Hello, A4F!' }]);
			mockExecuteFunction.getNodeParameter.calledWith('additionalFields', 0).mockReturnValue({});

			mockExecuteFunction.getInputData.mockReturnValue([{ json: {} }]);
			mockExecuteFunction.helpers.requestWithAuthentication.mockRejectedValue(
				new NodeApiError(mockExecuteFunction.getNode(), {
					error: {
						message: 'Invalid model',
						type: 'invalid_request_error',
					},
				}),
			);

			mockExecuteFunction.continueOnFail.mockReturnValue(true);

			// Execute
			const result = await nodeInstance.execute.call(mockExecuteFunction);

			// Assert
			expect(result).toEqual([
				[
					{
						json: {
							error: 'Invalid model',
						},
					},
				],
			]);
		});
	});
}); 
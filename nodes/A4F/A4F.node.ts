import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class A4F implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'A4F',
		name: 'a4f',
		icon: 'file:a4f.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Use the A4F API',
		defaults: {
			name: 'A4F',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'a4fApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat Completion',
						value: 'chatCompletion',
						description: 'Create a chat completion',
						action: 'Create a chat completion',
					},
				],
				default: 'chatCompletion',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				default: 'provider-1/chatgpt-4o-latest',
				description: 'The model to use for chat completion',
				required: true,
				displayOptions: {
					show: {
						operation: ['chatCompletion'],
					},
				},
			},
			{
				displayName: 'Messages',
				name: 'messages',
				placeholder: 'Add Message',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				default: {},
				displayOptions: {
					show: {
						operation: ['chatCompletion'],
					},
				},
				options: [
					{
						name: 'messagesUi',
						displayName: 'Message',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								options: [
									{
										name: 'System',
										value: 'system',
									},
									{
										name: 'User',
										value: 'user',
									},
									{
										name: 'Assistant',
										value: 'assistant',
									},
								],
								default: 'user',
								description: 'The role of the message',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								description: 'The content of the message',
							},
						],
					},
				],
			},
			{
				displayName: 'Options',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['chatCompletion'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						description:
							'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 1,
						},
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 1024,
						description:
							'The maximum number of tokens to generate in the chat completion',
						typeOptions: {
							minValue: 1,
						},
					},
					{
						displayName: 'Top P',
						name: 'top_p',
						type: 'number',
						default: 1,
						description:
							'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 1,
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'chatCompletion') {
					const model = this.getNodeParameter('model', i) as string;
					const messagesUi = this.getNodeParameter('messages.messagesUi', i, []) as Array<{
						role: string;
						content: string;
					}>;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
						temperature?: number;
						max_tokens?: number;
						top_p?: number;
					};

					const messages = messagesUi.map((messageUi) => ({
						role: messageUi.role,
						content: messageUi.content,
					}));

					const body: {
						model: string;
						messages: Array<{
							role: string;
							content: string;
						}>;
						temperature?: number;
						max_tokens?: number;
						top_p?: number;
					} = {
						model,
						messages,
					};

					if (additionalFields.temperature !== undefined) {
						body.temperature = additionalFields.temperature;
					}

					if (additionalFields.max_tokens !== undefined) {
						body.max_tokens = additionalFields.max_tokens;
					}

					if (additionalFields.top_p !== undefined) {
						body.top_p = additionalFields.top_p;
					}

					const response = await this.helpers.requestWithAuthentication.call(this, 'a4fApi', {
						method: 'POST',
						url: 'https://api.a4f.co/v1/chat/completions',
						body,
						json: true,
					});

					returnData.push({
						json: response,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error);
			}
		}

		return [returnData];
	}
} 
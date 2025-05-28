import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class A4FApi implements ICredentialType {
	name = 'a4fApi';
	displayName = 'A4F API';
	documentationUrl = 'https://www.a4f.co/docs/api-reference';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your A4F API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};
} 
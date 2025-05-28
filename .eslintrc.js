/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	ignorePatterns: ['.eslintrc.js', 'jest.config.js', '**/*.js', 'node_modules/**/*', 'dist/**/*'],

	plugins: ['n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],

	rules: {
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
		'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
	},
}; 
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	extends: ['./.eslintrc.js'],

	rules: {
		'n8n-nodes-base/community-package-json-name-still-default': 'error',
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'error',
	},
}; 
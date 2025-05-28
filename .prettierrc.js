module.exports = {
	semi: true,
	trailingComma: 'all',
	singleQuote: true,
	printWidth: 100,
	useTabs: true,
	tabWidth: 2,
	endOfLine: 'lf',
	arrowParens: 'always',
	overrides: [
		{
			files: ['*.vue'],
			options: {
				parser: 'vue',
				printWidth: 100,
				singleQuote: true,
				trailingComma: 'all',
				arrowParens: 'always',
				htmlWhitespaceSensitivity: 'ignore',
			},
		},
		{
			files: ['*.html'],
			options: {
				parser: 'html',
				printWidth: 100,
				singleQuote: true,
				trailingComma: 'all',
				arrowParens: 'always',
				htmlWhitespaceSensitivity: 'ignore',
			},
		},
	],
}; 
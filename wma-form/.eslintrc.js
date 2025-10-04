module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended'],
	plugins: ['@typescript-eslint'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'off',
		'no-unused-vars': 'off',
	},
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
};

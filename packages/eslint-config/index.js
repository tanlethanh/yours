module.exports = {
	extends: [
		require.resolve('./base'),
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
	],
	plugins: ['react-hooks'],
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react/prop-types': 'off',
		'@typescript-eslint/ban-types': 'off',
		'no-case-declarations': 'off',
	},
	settings: {
		react: { version: 'detect' },
	},
	globals: {
		document: true,
	},
};

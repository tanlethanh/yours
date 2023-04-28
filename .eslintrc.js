module.exports = {
	root: true,
	extends: ['@yours/eslint-config'],
	ignorePatterns: ['**/build/**'],
	env: {
		node: true,
	},
	globals: {
		window: true,
		document: true,
		navigator: true,
		fetch: true,
		WebAssembly: true,
	},
};

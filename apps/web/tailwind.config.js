/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/layouts/**/*.{js,ts,jsx,tsx}',
		'./src/utils/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
		extend: {
			fontFamily: {
				sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: '#000000',
				mainText: '#ffffff',
				auxText: '#9ea7b0',
			},
		},
	},
	plugins: [],
};

import type { AppProps } from 'next/app';
import { DataTestsProvider } from 'state/DataTestsContext';

import '../styles/globals.css';
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<DataTestsProvider>
			<Component {...pageProps} />{' '}
		</DataTestsProvider>
	);
}

export default MyApp;

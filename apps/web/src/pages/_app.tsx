import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DataTestsProvider } from 'state/DataTestsContext';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <DataTestsProvider>
            <Component {...pageProps} />{' '}
        </DataTestsProvider>
    );
}

export default MyApp;

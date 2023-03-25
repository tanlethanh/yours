import React from 'react';
import { DataTestsProvider } from '../store/DataTestsContext';
function Layout({ children }: { children: React.ReactNode }) {
    return (
       
            <html>
                <head></head>
                <body>
                    <div className="container"></div>

                    <div>{children}</div>
                </body>
            </html>
       
    );
}

export default Layout;

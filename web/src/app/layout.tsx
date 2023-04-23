import React from 'react';
function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <title>Sipo English</title>
            </head>
            <body>{children}</body>
        </html>
    );
}

export default Layout;

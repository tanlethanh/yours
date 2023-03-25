import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';

function MainLayout({ children, withHeader = true }: { children: React.ReactNode; withHeader: boolean }) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen min-w-screen items-center flex-col px-10 pt-0 pb-40">
            {withHeader && (
                <div className="w-full h-16">
                    <Header />
                </div>
            )}
            <div className="w-full min-h-full">
                <div className="max-w-[1200px] h-full m-auto">{children}</div>
            </div>
        </div>
    );
}

export default MainLayout;

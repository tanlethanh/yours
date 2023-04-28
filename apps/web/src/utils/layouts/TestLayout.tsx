import React, { useEffect, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';
import Head from 'next/head';
import { LottieTestError } from 'components';
function TestLayout({ children, title }: { children: React.ReactNode; title: string }) {
    const router = useRouter();
    const [statusLoading, setStatusLoading] = useState(true);
    const context = useContext(DataTestsContext);

    useEffect(() => {
        if (!router.isReady) return;
        const getData = async () => {
            if (!(children as any).props?.dataTest) {
                const { testId } = router.query;
                if (testId) {
                    const testDatas = await context.addTestsDataById(testId as string);

                    if (testDatas === undefined) {
                        setStatusLoading(false);
                        handleLoading();
                    }
                }
            }
        };
        getData();
    }, []);
    const handleLoading = () => {
        setTimeout(() => {
            router.replace('/dashboard');
        }, 1000);
    };
    return (
        <>
            {statusLoading ? (
                <AnimatePresence>
                    <div className="w-screen min-h-screen flex flex-col items-center mt-20">
                        <Head>
                            <title>Sipo English | Practice</title>
                        </Head>
                        <h1 className="font-medium text-3xl mb-10">{title ? title : 'Bài kiểm tra'}</h1>
                        <div>{children}</div>
                    </div>
                </AnimatePresence>
            ) : (
                <LottieTestError width={500} height={500}></LottieTestError>
            )}
        </>
    );
}

export default TestLayout;

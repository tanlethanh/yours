import React, { useEffect, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { apiAxios } from '../utils/axiosConfig';
import { DataTestsContext } from '../store/DataTestsContext';
import Head from 'next/head';
function TestLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const context = useContext(DataTestsContext);

    useEffect(() => {
        const getData = async () => {
            if ((children as any).props?.dataTest) {
                const { testId, questionId } = router.query;
                if (testId) {
                    await context.addTestsDataById(testId as string);
                }
            }
        };
        getData();
    }, []);

    return (
        <AnimatePresence>
            <div className="w-screen min-h-screen flex flex-col justify-center items-center">
                <Head>
                    <title>Sipo English | Practice</title>
                </Head>
                <h1 className="font-medium text-3xl mb-6">English test</h1>
                <div>{children}</div>
            </div>
        </AnimatePresence>
    );
}

export default TestLayout;

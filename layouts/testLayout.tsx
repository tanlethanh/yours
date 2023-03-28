import React, { useEffect, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { apiAxios } from '../utils/axiosConfig';
import { DataTestsContext } from '../store/DataTestsContext';
import Head from 'next/head';
import GetTestErrorElement from '../components/animatedElements/getTestErrorElement';
function TestLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [statusLoading, setStatusLoading] = useState(true);
    const context = useContext(DataTestsContext);

    useEffect(() => {
        if (!router.isReady) return;
        const getData = async () => {
            console.log((children as any).props?.dataTest);
            if (!(children as any).props?.dataTest) {
                const { testId } = router.query;
                if (testId) {
                    const testDatas = await context.addTestsDataById(testId as string);
                    console.log(testDatas);
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
                        <h1 className="font-medium text-3xl mb-20">Bài kiểm tra</h1>
                        <div>{children}</div>
                    </div>
                </AnimatePresence>
            ) : (
                <GetTestErrorElement width={500} height={500}></GetTestErrorElement>
            )}
        </>
    );
}

export default TestLayout;

import React, { useEffect, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { apiAxios } from '../utils/axiosConfig';
import { DataTestsContext } from '../store/DataTestsContext';
function TestLayout({ children }) {
    const router = useRouter();

    const context = useContext(DataTestsContext);

    useEffect(() => {
        const getData = async () => {
            if (children.props.dataTest) {
                const { testId, questionId } = router.query;
                if (testId) {
                     await context.addTestsDataById(testId);                  
                }
            }
        };
        getData();
    }, []);

    return (
        <AnimatePresence>
            <div className="w-screen min-h-screen flex flex-col justify-center items-center">
                <h1 className="font-medium text-3xl mb-6">English test</h1>
                <div>{children}</div>
            </div>
        </AnimatePresence>
    );
}

export default TestLayout;

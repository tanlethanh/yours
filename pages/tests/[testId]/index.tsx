import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { DataTestsContext } from '../../../store/DataTestsContext';
import QuizBumpElement from '../../../components/animatedElements/quizBumpElement';
function TestById() {
    const router = useRouter();

    const context = useContext(DataTestsContext);

    useEffect(() => {
        if (!router.isReady) return;
        const { testId } = router.query;
        const getData = async () => {
            if (testId) {
                const testsData = await context.addTestsDataById(testId as any);
            }
            router.replace(`/tests/${testId}/0`);
        };
        getData();
    }, [router.isReady]);

    return <QuizBumpElement width={500} height={500}></QuizBumpElement>;
}

export default TestById;

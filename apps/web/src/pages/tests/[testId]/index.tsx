import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';
import {LottieQuizBump} from 'components';
function TestById() {
    const router = useRouter();

    const context = useContext(DataTestsContext);
    const findIndexUserRecently = (question: any) => {
       
        return question.user_answer === undefined;
    };
    useEffect(() => {
        if (!router.isReady) return;
        const { testId } = router.query;
        const getData = async () => {
            let indexQuestion;
            if (testId) {
                const testsData = await context.addTestsDataById(testId as any);
                indexQuestion = testsData?.findIndex(findIndexUserRecently);
                
                if (indexQuestion === -1) indexQuestion = 0;
            }

            router.replace(`/tests/${testId}/${indexQuestion}`);
        };
        getData();
    }, [router.isReady]);

    return <LottieQuizBump width={500} height={500}></LottieQuizBump>;
}

export default TestById;

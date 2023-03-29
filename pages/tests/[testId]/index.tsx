import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { DataTestsContext } from '../../../store/DataTestsContext';
import QuizBumpElement from '../../../components/animatedElements/quizBumpElement';
function TestById() {
    const router = useRouter();

    const context = useContext(DataTestsContext);
    const findIndexUserRecently = (question: any) => {
        console.log(question.user_answer);
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
                console.log(indexQuestion);
                if (indexQuestion === undefined) indexQuestion = 0;
            }

            router.replace(`/tests/${testId}/${indexQuestion}`);
        };
        getData();
    }, [router.isReady]);

    return <QuizBumpElement width={500} height={500}></QuizBumpElement>;
}

export default TestById;

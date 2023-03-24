import React, { useEffect, useState } from 'react';
import TestLayout from '../../../layouts/testLayout';
import QuestionCard from '../../../components/question-card/questionCard';
import { useRouter } from 'next/router';
import { withAuth } from '../../../components/withAuth';
import { apiAxios } from '../../../utils/axiosConfig';

function TestPage() {
    const router = useRouter();
    const { testId, questionId } = router.query;
    const [dataTest, SetDataTest] = useState([]);
    const getNewTest = async () => {
        try {
            console.log('Get new test');
            const res = await apiAxios.get('/tests/new-test');

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const result = await getNewTest();
            if (result?.data?.test?.questions) {
                SetDataTest(result.data.test.questions);
            }
        };
        fetchData();
    }, []);
    console.log(dataTest);
    return (
        <TestLayout>
            <QuestionCard testId={testId} id={questionId} dataTest={dataTest} />
        </TestLayout>
    );
}

export default withAuth(TestPage);

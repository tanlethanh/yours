import React, { useContext, useEffect, useState } from 'react';
import TestLayout from '../../../layouts/testLayout';
import QuestionCard from '../../../components/question-card/questionCard';
import { useRouter } from 'next/router';
import { withAuth } from '../../../components/withAuth';
import { apiAxios } from '../../../utils/axiosConfig';
import { DataTestsContext } from '../../../store/DataTestsContext';

function TestPage() {
    const router = useRouter();
    const { testId, questionId } = router.query;
   
    const context = useContext(DataTestsContext);

    console.log(context.testsDatas);
    return (
        <TestLayout>
            <QuestionCard testId={testId} id={questionId} dataTest={context.testsDatas} />
        </TestLayout>
    );
}

export default withAuth(TestPage);

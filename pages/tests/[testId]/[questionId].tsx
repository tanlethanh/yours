import React, { useContext, useEffect, useState } from 'react';
import TestLayout from '../../../layouts/testLayout';
import QuestionCard from '../../../components/question-card/questionCard';
import { useRouter } from 'next/router';
import { withAuth } from '../../../components/withAuth';
import { apiAxios } from '../../../utils/axiosConfig';
import { DataTestsContext } from '../../../store/DataTestsContext';
import CongratsElement from '../../../components/animatedElements/congratsElement';
import Link from 'next/link';

function TestPage() {
    const router = useRouter();
    const { testId, questionId } = router.query;
    const [isFinal, setIsFinal] = useState(false);

    const context = useContext(DataTestsContext);

    console.log(context.testsDatas);
    return (
        <TestLayout>
            <QuestionCard testId={testId} id={questionId} dataTest={context.testsDatas} setFinal={setIsFinal} />
            {isFinal && (
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-col space-y-16 pt-10">
                        <div>
                            <h1 className="text-3xl font-medium mb-4">Kết quả</h1>
                            <p className="text-8xl"> 27/30</p>
                        </div>
                        <Link href={'/dashboard'} className="w-fit px-8 py-3 border border-gray-300 rounded-md">
                            {' '}
                            Về trang chính
                        </Link>
                    </div>
                    <div>
                        <CongratsElement width={400} height={400}></CongratsElement>
                    </div>
                </div>
            )}
        </TestLayout>
    );
}

export default withAuth(TestPage);

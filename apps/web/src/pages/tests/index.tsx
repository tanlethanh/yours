import router from 'next/router';
import React, { useContext, useEffect } from 'react';
import { withAuth } from '../../components/withAuth';
import { DataTestsContext } from '../../store/DataTestsContext';
import QuizBumpElement from '../../components/animatedElements/quizBumpElement';

function Tests() {
    const context = useContext(DataTestsContext);
    const handleAddTestsData = async () => {
        const testId = await context.addTestsData();
        router.replace(`/tests/${testId}/0`);
    };

    useEffect(() => {
        handleAddTestsData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-5">
            <QuizBumpElement width={500} height={500}></QuizBumpElement>
        </div>
    );
}

export default withAuth(Tests);

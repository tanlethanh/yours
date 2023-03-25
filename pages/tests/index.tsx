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

    // const syncData = async () => {
    //     try {
    //         console.log('Sync data');
    //         const res = await apiAxios.post('/notion/data/sync');
    //         console.log(res);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    useEffect(() => {
        handleAddTestsData();
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-5">
            {/* <h1 className="text-4xl font-extrabold">Tests</h1>
            <button className="w-fit px-8 py-3 border border-gray-300 rounded-md" onClick={syncData}>
                Sync data
            </button>
            <button className="w-fit px-8 py-3 border border-gray-300 rounded-md" onClick={handleAddTestsData}>
                Get New Test
            </button> */}
            <QuizBumpElement width={500} height={500}></QuizBumpElement>
        </div>
    );
}

export default withAuth(Tests);

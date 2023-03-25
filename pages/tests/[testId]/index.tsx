import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { apiAxios } from '../../../utils/axiosConfig';
import { DataTestsContext } from '../../../store/DataTestsContext';
function TestById() {
    const router = useRouter();
    const { testId } = router.query;
    const context = useContext(DataTestsContext);

    useEffect(() => {
        const getData = async () => {
          
                const { testId } = router.query;
                if (testId) {
                    const testsData = await context.addTestsDataById(testId);

                    console.log(testsData);
                }
            
        };
        getData();
    });

    useEffect(() => {

        router.replace(`/tests/${testId}/0`);
    });

    console.log('Hoang dang o da');
    return <div>TestById</div>;
}

export default TestById;

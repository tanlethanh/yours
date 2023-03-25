import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { apiAxios } from '../../../utils/axiosConfig';
import { DataTestsContext } from '../../../store/DataTestsContext';
import LoadingElement from '../../../components/animatedElements/loadingElement';
import Loading from '../../../components/loading';
function TestById() {
    const router = useRouter();
    const { testId } = router.query;
    const context = useContext(DataTestsContext);

    useEffect(() => {
        const getData = async () => {
            if (testId) {
                const testsData = await context.addTestsDataById(testId as any);
                console.log('Hello world');
                console.log(testsData);
            }
            router.replace(`/tests/${testId}/0`);
        };
        getData();
    }, []);

    return <Loading />;
}

export default TestById;

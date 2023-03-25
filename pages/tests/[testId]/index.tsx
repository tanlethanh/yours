import React, { useEffect, useState } from 'react';

import { apiAxios } from '../../../utils/axiosConfig';
function TestById() {
    // const [dataTest, SetDataTest] = useState([]);
    // const getNewTest = async () => {
    //     try {
    //         console.log('Get new test');
    //         const res = await apiAxios.get('/tests/new-test');

    //         return res;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await getNewTest();
    //         if (result?.data?.test?.questions) {
    //             SetDataTest(result.data.test.questions);
    //         }
    //     };
    //     fetchData();
    // }, []);
    console.log('Hoang dang o da');
    return <div>TestById</div>;
}

export default TestById;

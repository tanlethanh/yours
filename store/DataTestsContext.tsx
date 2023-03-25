import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiAxios } from '../utils/axiosConfig';
type DataTestsContextType = {
    testsDatas: [];
    testsId: String;
    addTestsData: () => Promise<void>;
    addTestsDataById: (testId: string) => Promise<void>;
};

const DataTestsContext = createContext<DataTestsContextType>({
    testsDatas: [],
    testsId: '',
    addTestsData: async () => {},
    addTestsDataById: async (testId: string) => {},
});

type DataTestsProviderProps = {
    children: ReactNode;
};

function DataTestsProvider({ children }: DataTestsProviderProps) {
    const [testsDatas, setTestsDatas] = useState<any>([]);
    const [testsId, setTestsId] = useState<any>('aa');
    // useEffect(() => {
    //     addTestsData();
    // }, []);
    const getNewTest = async () => {
        try {
            const res = await apiAxios.get('/tests/new-test');

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    const getTestById = async (testId: string) => {
        try {
            const res = await apiAxios.get(`tests/${testId}?with-questions=true`);

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    async function addTestsDataById(testId: string) {
        const result = await getTestById(testId);

        if (result?.data?.test) {
            console.log(result?.data?.test);
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
        return result?.data.questions;
    }
    async function addTestsData() {
        const result = await getNewTest();

        if (result?.data?.test) {
            console.log(result?.data?.test);
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
        return result?.data.test._id;
    }

    const contextValue: DataTestsContextType = {
        testsDatas: testsDatas,
        addTestsData: addTestsData,
        testsId: testsId,
        addTestsDataById: addTestsDataById,
    };

    return <DataTestsContext.Provider value={contextValue}>{children}</DataTestsContext.Provider>;
}

export { DataTestsProvider, DataTestsContext };

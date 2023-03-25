import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiAxios } from '../utils/axiosConfig';
type DataTestsContextType = {
    testsDatas: [];
    testsId: String;
    addTestsData: () => Promise<void>;
};

const DataTestsContext = createContext<DataTestsContextType>({
    testsDatas: [],
    testsId: '',
    addTestsData: async () => {},
});

type DataTestsProviderProps = {
    children: ReactNode;
};

function DataTestsProvider({ children }: DataTestsProviderProps) {
    const [testsDatas, setTestsDatas] = useState<any>([]);
    const [testsId, setTestsId] = useState<any>('');
    useEffect(() => {
        addTestsData();
    }, []);
    const getNewTest = async () => {
        try {
            const res = await apiAxios.get('/tests/new-test');

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    async function addTestsData() {
        const result = await getNewTest();

        if (result?.data?.test) {
            console.log(result?.data?.test);
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
    }

    const contextValue: DataTestsContextType = {
        testsDatas: testsDatas,
        addTestsData: addTestsData,
        testsId: testsId,
    };

    return <DataTestsContext.Provider value={contextValue}>{children}</DataTestsContext.Provider>;
}

export { DataTestsProvider, DataTestsContext };

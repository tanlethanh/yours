import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiAxios } from '../utils/axiosConfig';
type DataTestsContextType = {
    testsDatas: [];
    addTestsData: () => Promise<void>;
};

const DataTestsContext = createContext<DataTestsContextType>({
    testsDatas: [],
    addTestsData: async () => {},
});

type DataTestsProviderProps = {
    children: ReactNode;
};

function DataTestsProvider({ children }: DataTestsProviderProps) {
    const [testsDatas, setTestsDatas] = useState<any>([]);

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
        console.log(result);
        if (result?.data?.test?.questions) {
            setTestsDatas(result.data.test.questions);
        }
    }

    const contextValue: DataTestsContextType = {
        testsDatas: testsDatas,
        addTestsData: addTestsData,
    };

    return <DataTestsContext.Provider value={contextValue}>{children}</DataTestsContext.Provider>;
}

export { DataTestsProvider, DataTestsContext };

import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiAxios } from '../utils/axiosConfig';
type DataTestsContextType = {
    testsDatas: [];
    testsId: String;
    addTestsData: () => Promise<void>;
    addTestsDataById: (testId: string) => any;
    updateQuestionById: (index: number, userAnwser: string) => {};
};

const DataTestsContext = createContext<DataTestsContextType>({
    testsDatas: [],
    testsId: '',
    addTestsData: async () => {},
    addTestsDataById: async (testId: string) => {},
    updateQuestionById: async (index: number, userAnwser: string) => {},
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
    const updateQuestionByIdService = async (questionId: string, userAnswer: string) => {
        try {
            const res = await apiAxios.post(`/questions/${questionId}?action=update-answer`, {
                userAnswer,
            });
        } catch (err) {
            console.log(err);
        }
    };
    const getNewTestService = async () => {
        try {
            const res = await apiAxios.get('/tests/new-test');

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    const getTestByIdService = async (testId: string) => {
        try {
            const res = await apiAxios.get(`tests/${testId}?with-questions=true`);

            return res;
        } catch (err) {
            console.log(err);
        }
    };
    async function addTestsDataById(testId: string) {
        const result = await getTestByIdService(testId);

        if (result?.data?.test) {
            console.log(result?.data?.test);
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
        return result?.data.test.questions;
    }
    async function addTestsData() {
        const result = await getNewTestService();

        if (result?.data?.test) {
            console.log(result?.data?.test);
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
        return result?.data.test._id;
    }

    async function updateQuestionById(index: number, userAnwser: string) {
        let questionId = testsDatas[index]._id as string;
        await updateQuestionByIdService(questionId, userAnwser);
        testsDatas[index].userAnwser = userAnwser;
    }

    const contextValue: DataTestsContextType = {
        testsDatas: testsDatas,
        testsId: testsId,
        addTestsData: addTestsData,
        addTestsDataById: addTestsDataById,
        updateQuestionById: updateQuestionById,
    };

    return <DataTestsContext.Provider value={contextValue}>{children}</DataTestsContext.Provider>;
}

export { DataTestsProvider, DataTestsContext };

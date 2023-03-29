import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiAxios } from '../utils/axiosConfig';
type DataTestsContextType = {
    
    testsDatas: any;
    testsId: String;
    isFullAnswer: boolean;
    addTestsData: () => Promise<void>;
    addTestsDataById: (testId: string) => any;
    updateQuestionById: (index: number, userAnwser: any) => {};
};

const DataTestsContext = createContext<DataTestsContextType>({
    testsDatas: [],
    testsId: '',
    isFullAnswer: false,
    addTestsData: async () => {},
    addTestsDataById: async (testId: string) => {},
    updateQuestionById: async (index: number, userAnwser: any) => {},
});

type DataTestsProviderProps = {
    children: ReactNode;
};

function DataTestsProvider({ children }: DataTestsProviderProps) {
    const [testsDatas, setTestsDatas] = useState<any>([]);
    const [testsId, setTestsId] = useState<any>('aa');
    const [isFullAnswer, setIsFullAnswer] = useState(false);
    const [countAnwser, setCountAnwser] = useState(0);

    useEffect(() => {
        if (testsDatas?.length > 0 && testsDatas?.length === countAnwser) {
            console.log(testsDatas.length);
            setIsFullAnswer(true);
        }
        console.log(countAnwser);
    }, [countAnwser]);
    const updateQuestionByIdService = async (questionId: string, userAnswer: any) => {
        try {
            const res = await apiAxios.post(`/questions/${questionId}?action=update-answer`, {
                userAnswer,
            });
            return res;
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
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
            let count = 0;
            result.data.test.questions.forEach((item: any) => {
                if (item.user_answer !== undefined) count += 1;
            });
            setCountAnwser(count);
        }
        return result?.data?.test?.questions;
    }

    async function addTestsData() {
        const result = await getNewTestService();

        if (result?.data?.test) {
            setTestsDatas(result.data.test.questions);
            setTestsId(result.data.test._id);
        }
        return result?.data.test._id;
    }

    async function updateQuestionById(index: number, userAnwser: any) {
        let questionId = testsDatas[index]._id as string;
        const res = await updateQuestionByIdService(questionId, userAnwser);
        if (res) setCountAnwser((countAnwser) => countAnwser + 1);
        testsDatas[index].user_answer = userAnwser;
    }

    const contextValue: DataTestsContextType = {
        testsDatas: testsDatas,
        testsId: testsId,
        isFullAnswer,
        addTestsData: addTestsData,
        addTestsDataById: addTestsDataById,
        updateQuestionById: updateQuestionById,
    };

    return <DataTestsContext.Provider value={contextValue}>{children}</DataTestsContext.Provider>;
}

export { DataTestsProvider, DataTestsContext };

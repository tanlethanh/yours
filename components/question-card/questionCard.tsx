import React, { useState, useContext } from 'react';
import { FullTextQuestion, HalfTextQuestion, MultichoiceQuestion } from '.';
import { useRouter } from 'next/router';
import { DataTestsContext } from '../../store/DataTestsContext';

function QuestionCard({ testId, id, dataTest, setFinal }: any) {
    const router = useRouter();
    const type = dataTest[id]?.type;
    const context = useContext(DataTestsContext);
    const [userAnswer, setUserAnswer] = useState('-1');
    const handleGetUserAnswer = (userAnswer: string) => {
        setUserAnswer(userAnswer);
    };
    switch (type) {
        case 'MULTICHOICE':
            const answers: { text: string; isSolution: boolean }[] = [];
            dataTest[id].answers.forEach((answer: string, index: number) =>
                answers.push({ text: answer, isSolution: dataTest[id].solution_index === index }),
            );
            return (
                <MultichoiceQuestion
                    key={dataTest[id]._id}
                    question={dataTest[id].question_text}
                    hint="Hello guy"
                    userAnswer={dataTest[id].user_answer}
                    answers={answers}
                    updateNumberCorrect={undefined}
                    handleGetUserAnswer={handleGetUserAnswer}
                    title={'Hello'}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                        context.updateQuestionById(id, userAnswer);
                        console.log(context.testsDatas);
                    }}
                />
            );

        case 'FILLWORD':
            let indexSolution = dataTest[id].solution_index;
            let prefixQuestion = dataTest[id].list_words.slice(0, indexSolution).join(' ');
            let suffixQuestion = dataTest[id].list_words.slice(indexSolution + 1).join(' ');
            return (
                <HalfTextQuestion
                    key={dataTest[id]._id}
                    title="Half text question"
                    prefixQuestion={prefixQuestion}
                    suffixQuestion={suffixQuestion}
                    hint=""
                    solution={dataTest[id].list_words[indexSolution]}
                    handleGetUserAnswer={handleGetUserAnswer}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                        context.updateQuestionById(id, userAnswer);
                        console.log(context.testsDatas);
                    }}
                ></HalfTextQuestion>
            );
        case 'TRANSLATE':
            return (
                <FullTextQuestion
                    key={dataTest[id]._id}
                    title="Full text question"
                    question={dataTest[id].question_text}
                    solution={dataTest[id].solution}
                    handleGetUserAnswer={handleGetUserAnswer}
                    hint={''}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                        context.updateQuestionById(id, userAnswer);
                        console.log(context.testsDatas);
                    }}
                />
            );
        default:
            // data test need to produce to set final
            if (dataTest.length > 0) setFinal(true);
            return null;
    }
}

export default QuestionCard;

import React, { useState, useContext, useEffect } from 'react';
import { TranslateQuestion, FillQuestion, MultichoiceQuestion } from '.';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';

function QuestionCard({ testId, id, setFinal }: any) {
    const router = useRouter();
    const context = useContext(DataTestsContext);

    const findIndexUserRecently = (question: any) => {
        return question.user_answer === undefined;
    };
    useEffect(() => {
        if (id) {
            console.log(context.isFullAnswer);
            if (context.isFullAnswer && context.testsDatas.length > 0 && +id >= context.testsDatas.length) {
                console.log('sdsd');
                setFinal(true);
            } else if (!context.isFullAnswer && context.testsDatas.length > 0 && +id >= context.testsDatas.length) {
                console.log(id);
                console.log(context.testsDatas);
                let indexQuestion = context.testsDatas?.findIndex(findIndexUserRecently);
                if (indexQuestion === -1) indexQuestion = 0;
                router.replace(`/tests/${testId}/${indexQuestion}`);
            }
        }
    }, []);

    switch (context.testsDatas[id]?.type) {
        case 'MULTICHOICE':
            const answers: { text: string; isSolution: boolean }[] = [];
            context.testsDatas[id].answers.forEach((answer: string, index: number) =>
                answers.push({ text: answer, isSolution: context.testsDatas[id].solution_index === index }),
            );
            return (
                <MultichoiceQuestion
                    id={id}
                    key={context.testsDatas[id]._id}
                    question={context.testsDatas[id].question_text}
                    hint="Hello guy"
                    userAnswer={context.testsDatas[id].user_answer}
                    answers={answers}
                    updateNumberCorrect={undefined}
                    title={`Câu ${+id + 1}`}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                    }}
                />
            );

        case 'FILLWORD':
            let indexSolution = context.testsDatas[id].solution_index;
            let prefixQuestion = context.testsDatas[id].list_words.slice(0, indexSolution).join(' ');
            let suffixQuestion = context.testsDatas[id].list_words.slice(indexSolution + 1).join(' ');
            return (
                <FillQuestion
                    id={id}
                    key={context.testsDatas[id]._id}
                    title={`Câu ${+id + 1}`}
                    prefixQuestion={prefixQuestion}
                    suffixQuestion={suffixQuestion}
                    userAnswer={context.testsDatas[id].user_answer}
                    hint={context.testsDatas[id].hint}
                    solution={context.testsDatas[id].list_words[indexSolution]}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                    }}
                ></FillQuestion>
            );
        case 'TRANSLATE':
            return (
                <TranslateQuestion
                    id={id}
                    key={context.testsDatas[id]._id}
                    title={`Câu ${+id + 1}`}
                    question={context.testsDatas[id].question_text}
                    userAnswer={context.testsDatas[id].user_answer}
                    solution={context.testsDatas[id].solution}
                    hint={''}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
                    }}
                />
            );
        default:
            // // data test need to produce to set final
            // if (dataTest.length > 0) setFinal(true);
            return null;
    }
}

export default QuestionCard;

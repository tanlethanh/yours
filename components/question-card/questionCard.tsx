import React from 'react';
import { FullTextQuestion, HalfTextQuestion, MultichoiceQuestion } from '.';
import { useRouter } from 'next/router';
function QuestionCard({ testId, id, dataTest, setFinal }: any) {
    const router = useRouter();
    const type = dataTest[id]?.type;

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
                    answers={answers}
                    updateNumberCorrect={undefined}
                    title={'Hello'}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);                     
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
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
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
                    hint={''}
                    next={() => {
                        router.push(`/tests/${testId}/${Number(id) + 1}`);
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

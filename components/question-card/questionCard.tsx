import React from 'react';
import { FullTextQuestion, HalfTextQuestion, MultichoiceQuestion } from '.';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';

function QuestionCard({ testId, id, dataTest }: any) {
    const router = useRouter();
    const type = dataTest[id]?.type;
    // console.log(type);
    switch (type) {
        case 'MULTICHOICE':
            return (
                <MultichoiceQuestion
                    key={dataTest[id]._id}
                    question={dataTest[id].question_text}
                    hint="Hello guy"
                    answers={[
                        {
                            text: 'Hello my name is Tan',
                            isSolution: true,
                        },
                        {
                            text: 'Hello my name is Nhi',
                        },
                        {
                            text: 'Hello my name is Tan',
                        },
                        {
                            text: 'Xin chao tat ca cac ban',
                        },
                    ]}
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
            return null;
    }
}

export default QuestionCard;

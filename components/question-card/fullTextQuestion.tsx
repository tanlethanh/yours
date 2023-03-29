import React, { useState, useContext, useEffect } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import TextareaAutosize from 'react-textarea-autosize';
import { PrimaryButton } from '../../utils/button';
import { ToastContainerCustom, toast } from '../../utils/ToastCustom';
import { DataTestsContext } from '../../store/DataTestsContext';

function FullTextQuestion({
    title = 'Full text question',
    question,
    hint,
    id,
    solution,
    userAnswer,
    next,
}: {
    title: String;
    id: String;
    question: String;
    userAnswer: string;
    hint: any;
    solution: String;
    next: Function;
}) {
    const [checked, setChecked] = useState(false);
    const [answer, setAnswer] = useState('');
    const context = useContext(DataTestsContext);
    useEffect(() => {
        if (userAnswer) {
            setAnswer(userAnswer);
            setChecked(true);
        }
    }, []);
    const checkButtonOnclick = () => {
        if (!checked) {
            if (answer.trim().length > 0) {
                // if (compareSolution()) {
                //     toast.success('Yeahhhh! Keep going');
                // } else {
                //     toast.error("Oh no! It's wrong");
                // }
                context.updateQuestionById(+id, answer);
                setChecked(true);
            } else {
                toast.error('Please type your answer!');
            }
        }
    };

    const textAreaOnKeyDown = (event: any) => {
        if (event.key == 'Enter') {
            checkButtonOnclick();
        }
    };

    const compareSolution = () => {
        return answer.toLowerCase().trim() == solution.toLowerCase().trim();
    };

    const getLabel = () => {
        if (checked) {
            if (compareSolution()) return 'correct';
            else return 'incorrect';
        } else {
            return '';
        }
    };

    return (
        <div className="questionCard fullTextQuestion">
            <div className="flex flex-row space-x-2">
                <QuestionMarkCircleIcon className="w-5"></QuestionMarkCircleIcon>
                <p>{title}</p>
            </div>

            <div className="flex flex-col pb-5 space-y-1">
                <p className="text-lg font-bold">{question}</p>
                {hint && <p className="italic">Hint: {hint}</p>}
            </div>

            <div className="min-height-200px">
                <TextareaAutosize
                    rows={1}
                    className={'border-l-4 border-opacity-70 border-black w-full p-2 focus:outline-none ' + getLabel()}
                    placeholder="Write your answer!"
                    onChange={(e) => {
                        if (!checked) {
                            setAnswer(e.target.value);
                        }
                    }}
                    onKeyDown={textAreaOnKeyDown}
                    value={answer}
                />
                {getLabel() === 'incorrect' && <p className="correct">{solution}</p>}
            </div>

            <PrimaryButton onClick={checked ? next : checkButtonOnclick} animate={{ x: checked ? 155 : 0 }}>
                {!checked ? 'Check' : 'Next question'}
            </PrimaryButton>

            <ToastContainerCustom />
        </div>
    );
}

export { FullTextQuestion };

import React, { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import TextareaAutosize from 'react-textarea-autosize';
import { PrimaryButton } from '../../utils/button';
import { ToastContainerCustom, toast } from '../../utils/ToastCustom';

function HalfTextQuestion({
    title = 'Half text question',
    prefixQuestion,
    suffixQuestion,
    hint,
    solution,
    next,
    handleGetUserAnswer,
}: {
    title: String;
    prefixQuestion: String;
    suffixQuestion: String;
    hint: any;
    solution: String;
    next: Function;
    handleGetUserAnswer: Function;
}) {
    const [checked, setChecked] = useState(false);
    const [answer, setAnswer] = useState('');
    const [warningLimit, setWarningLimit] = useState(false);

    const checkButtonOnclick = () => {
        if (!checked) {
            if (answer.trim().length > 0) {
                // if (compareSolution()) {
                //     toast.success('Yeahhhh! Keep going');
                // } else {
                //     toast.error("Oh no! It's wrong");
                // }
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

    const getAnswerText = () => {
        return answer + Array(solution.length - answer.length + 1).join('_');
    };

    return (
        <div className="questionCard fullTextQuestion">
            <div className="flex flex-row space-x-2">
                <QuestionMarkCircleIcon className="w-5"></QuestionMarkCircleIcon>
                <p>{title}</p>
            </div>

            <div className="flex flex-col pb-5 space-y-1">
                <p className="text-lg font-bold">
                    <span> {prefixQuestion.trim()} </span>
                    <span> {getAnswerText()} </span>
                    <span> {suffixQuestion.trim()} </span>
                </p>
                {hint && <p className="italic">Hint: {hint}</p>}
            </div>

            <div className="min-height-200px">
                <TextareaAutosize
                    rows={1}
                    className={'border-l-4 border-opacity-70 border-black w-full p-2 focus:outline-none ' + getLabel()}
                    placeholder="Write your answer!"
                    onChange={(e) => {
                        if (!checked && e.target.value.length <= solution.length) {
                            setAnswer(e.target.value);
                            handleGetUserAnswer(e.target.value);
                        } else if (e.target.value.length > solution.length) {
                            if (!warningLimit) {
                                toast.info(`Limit ${solution.length} characters`);
                                setWarningLimit(true);
                            }
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

export { HalfTextQuestion };

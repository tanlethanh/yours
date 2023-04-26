import React, { useState, useContext, useEffect } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import TextareaAutosize from 'react-textarea-autosize';
import { PrimaryButton } from '../utils/button';
import { ToastContainerCustom, toast } from '../utils/ToastCustom';
import { DataTestsContext } from '../../store/DataTestsContext';
import { motion } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/solid';

function HalfTextQuestion({
    id,
    title = 'Half text question',
    prefixQuestion,
    suffixQuestion,
    hint,
    solution,
    userAnswer,
    next,
}: {
    id: String;
    title: String;
    prefixQuestion: String;
    suffixQuestion: String;
    hint: any;
    userAnswer: string;
    solution: String;
    next: Function;
}) {
    const [checked, setChecked] = useState(false);
    const [answer, setAnswer] = useState('');
    const [warningLimit, setWarningLimit] = useState(false);
    const context = useContext(DataTestsContext);
    const [renderHint, setRenderHint] = useState(0);

    useEffect(() => {
        if (renderHint == 1) {
            setTimeout(() => {
                setRenderHint((hint) => hint + 1);
            }, 1500);
        }
    }, [renderHint]);

    useEffect(() => {
        if (userAnswer) {
            setAnswer(userAnswer);
            setChecked(true);
        }
    }, []);

    const checkButtonOnclick = async () => {
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
                try {
                    toast.error('Hãy nhập câu trả lời!');
                } catch {}
            }
        }
    };

    const textAreaOnKeyDown = (event: any) => {
        if (event.key == 'Enter') {
            if (!checked) {
                checkButtonOnclick();
            } else {
                next();
            }
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

    const showHint = {
        x: 0,
        opacity: 1,
        display: 'block',
    };

    const hideHint = {
        x: 50,
        opacity: 0,
        transitionEnd: {
            display: 'none',
        },
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="questionCard fullTextQuestion"
        >
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
                {hint &&
                    (renderHint > 0 ? (
                        <motion.p
                            initial={{ x: -50, opacity: 0 }}
                            animate={renderHint == 1 ? showHint : hideHint}
                            transition={{ type: 'spring' }}
                            className="italic text-zinc-500"
                        >
                            Hint: {hint}
                        </motion.p>
                    ) : (
                        <p className="italic text-zinc-500">
                            Hint:{' '}
                            <EyeIcon
                                width={18}
                                height={18}
                                className="cursor-pointer inline-block"
                                onClick={() => {
                                    setRenderHint((renderHint) => renderHint + 1);
                                }}
                            ></EyeIcon>
                        </p>
                    ))}
            </div>

            <div className="min-height-200px">
                <TextareaAutosize
                    rows={1}
                    className={'border-l-4 border-opacity-70 border-black w-full p-2 focus:outline-none ' + getLabel()}
                    placeholder="Write your answer!"
                    onChange={(e) => {
                        if (!checked && e.target.value.length <= solution.length) {
                            setAnswer(e.target.value);
                        } else if (e.target.value.length > solution.length) {
                            if (e.target.value[e.target.value.length - 1] == '\n') return;
                            if (!warningLimit) {
                                toast.info(`Giới hạn ${solution.length} ký tự`);
                                setWarningLimit(true);
                            }
                        }
                    }}
                    onKeyDown={textAreaOnKeyDown}
                    value={answer}
                    autoFocus={true}
                />
                {getLabel() === 'incorrect' && <p className="correct">{solution}</p>}
            </div>

            <PrimaryButton onClick={checked ? next : checkButtonOnclick} animate={{ x: checked ? 155 : 0 }}>
                {!checked ? 'Check' : 'Next question'}
            </PrimaryButton>

            <ToastContainerCustom />
        </motion.div>
    );
}

export { HalfTextQuestion };

import { useContext, useEffect, useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { PrimaryButton } from 'components/button';
import { motion } from 'framer-motion';
import { DataTestsContext } from 'state/DataTestsContext';
import { toast, ToastContainerCustom } from 'utils/ToastCustom';

function MultichoiceQuestion({
	title = 'Full text question',
	question,
	answers,
	id,
	updateNumberCorrect,
	next,
	userAnswer,
}: {
	title: string;
	question: string;
	id: string;
	userAnswer: string;
	answers: [
		{
			text: string;
			isSolution: boolean;
		},
	];
	updateNumberCorrect: Function | undefined;
	next: Function;
}) {
	const [chosenIndex, setChosenIndex] = useState(-1);
	const [checked, setChecked] = useState(false);
	const context = useContext(DataTestsContext);
	const checkButtonOnclick = () => {
		if (chosenIndex == -1) {
			return toast.error('Hãy chọn đáp án!');
		}

		setChecked(true);
		context.updateQuestionById(+id, chosenIndex);
		if (answers[chosenIndex]?.isSolution) {
			if (typeof updateNumberCorrect == 'function') {
				updateNumberCorrect((prevNum: number) => prevNum + 1);
			}
			// toast.success('Yeahhhh! Keep going')
		} else {
			// toast.error("Oh no! It's wrong")
		}
	};
	useEffect(() => {
		if (userAnswer) {
			setChosenIndex(+userAnswer);
			setChecked(true);
		}
	}, []);
	const getLabel = (index: number) => {
		if (checked && index == chosenIndex && !answers[index].isSolution) {
			return 'incorrect';
		} else if (checked && answers[index].isSolution) {
			return 'correct';
		} else if (!checked && index === chosenIndex) {
			return 'chosen';
		}
		return '';
	};

	return (
		<motion.div
			initial={{ x: 300, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -300, opacity: 0 }}
			className="questionCard multichoiceQuestion"
		>
			<div className="flex flex-col space-y-2">
				<div className="flex flex-row space-x-2">
					<QuestionMarkCircleIcon className="w-5"></QuestionMarkCircleIcon>
					<p>{title}</p>
				</div>
				<p className="text-lg font-bold">{question}</p>
				{/* {hint && <p className="italic text-zinc-600">Hint: {hint}</p>} */}
			</div>

			<div className="flex flex-col w-full space-y-2">
				{answers?.map((ans, index) => {
					const ansLabel = getLabel(index);

					return (
						<motion.button
							key={index}
							className={
								'border rounded-lg w-full p-3 text-left ' +
								ansLabel
							}
							onClick={() => {
								if (!checked) {
									if (index == chosenIndex) {
										setChosenIndex(-1);
									} else {
										setChosenIndex(index);
									}
								}
							}}
							whileHover={{ scale: checked ? 1 : 1.05 }}
							whileTap={{ scale: checked ? 1 : 0.9 }}
						>
							{ansLabel == 'correct' && (
								<CheckCircleIcon className="w-6 inline-block mb-0.5 mr-2" />
							)}
							{ansLabel == 'incorrect' && (
								<XCircleIcon className="w-6 inline-block mb-0.5 mr-2" />
							)}
							{ans.text}
						</motion.button>
					);
				})}
			</div>

			<PrimaryButton
				onClick={checked ? next : checkButtonOnclick}
				animate={{ x: checked ? 155 : 0 }}
			>
				{!checked ? 'Check' : 'Next question'}
			</PrimaryButton>

			<ToastContainerCustom />
		</motion.div>
	);
}

export { MultichoiceQuestion };

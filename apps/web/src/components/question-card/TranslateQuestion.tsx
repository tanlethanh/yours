import { useContext, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from 'components/Button';
import { DataTestsContext } from 'state/DataTestsContext';
import { toast, ToastContainerCustom } from 'utils/ToastCustom';

export function TranslateQuestion({
	title = 'Full text question',
	question,
	id,
	solution,
	userAnswer,
	next,
}: {
	title: string;
	id: string;
	question: string;
	userAnswer: string;
	solution: string;
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
				toast.error('Hãy nhập câu trả lời!');
			}
		}
	};

	const textAreaOnKeyDown = (event: KeyboardEvent) => {
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

	return (
		<div className="questionCard fullTextQuestion">
			<div className="flex flex-row space-x-2">
				<QuestionMarkCircleIcon className="w-5"></QuestionMarkCircleIcon>
				<p>{title}</p>
			</div>

			<div className="flex flex-col pb-5 space-y-1">
				<p className="text-lg font-bold">{question}</p>
				{/* {hint && <p className="italic">Hint: {hint}</p>} */}
			</div>

			<div className="min-height-200px">
				<TextareaAutosize
					rows={1}
					className={
						'border-l-4 border-opacity-70 border-black w-full p-2 focus:outline-none ' +
						getLabel()
					}
					placeholder="Write your answer!"
					onChange={(e) => {
						if (!checked) {
							setAnswer(e.target.value);
						}
					}}
					onKeyDown={textAreaOnKeyDown as never}
					value={answer}
					autoFocus={true}
				/>
				{getLabel() === 'incorrect' && (
					<p className="correct">{solution}</p>
				)}
			</div>

			<PrimaryButton
				onClick={checked ? next : checkButtonOnclick}
				animate={{ x: checked ? 155 : 0 }}
			>
				{!checked ? 'Check' : 'Next question'}
			</PrimaryButton>

			<ToastContainerCustom />
		</div>
	);
}

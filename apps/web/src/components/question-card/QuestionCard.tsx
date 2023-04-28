import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';

import { FillQuestion, MultichoiceQuestion, TranslateQuestion } from '.';

interface Props {
	testId: string;
	id: string;
	setFinal: Function;
}

export function QuestionCard({ testId, id, setFinal }: Props) {
	const router = useRouter();
	const context = useContext(DataTestsContext);

	const findIndexUserRecently = (question: { user_answer: undefined }) => {
		return question.user_answer === undefined;
	};
	useEffect(() => {
		if (id) {
			console.log(context.isFullAnswer);
			if (
				context.isFullAnswer &&
				context.testsDatas.length > 0 &&
				+id >= context.testsDatas.length
			) {
				console.log('sdsd');
				setFinal(true);
			} else if (
				!context.isFullAnswer &&
				context.testsDatas.length > 0 &&
				+id >= context.testsDatas.length
			) {
				console.log(id);
				console.log(context.testsDatas);
				let indexQuestion = context.testsDatas?.findIndex(
					findIndexUserRecently,
				);
				if (indexQuestion === -1) indexQuestion = 0;
				router.replace(`/tests/${testId}/${indexQuestion}`);
			}
		}
	}, []);

	switch (context.testsDatas[id]?.type) {
		case 'MULTICHOICE':
			const answers: { text: string; isSolution: boolean }[] = [];
			context.testsDatas[id].answers.forEach(
				(answer: string, index: number) =>
					answers.push({
						text: answer,
						isSolution:
							context.testsDatas[id].solution_index === index,
					}),
			);
			return (
				<MultichoiceQuestion
					id={id}
					key={context.testsDatas[id]._id}
					question={context.testsDatas[id].question_text}
					userAnswer={context.testsDatas[id].user_answer}
					answers={answers as never}
					updateNumberCorrect={undefined}
					title={`Câu ${+id + 1}`}
					next={() => {
						router.push(`/tests/${testId}/${Number(id) + 1}`);
					}}
				/>
			);

		case 'FILLWORD':
			const indexSolution = context.testsDatas[id].solution_index;
			const prefixQuestion = context.testsDatas[id].list_words
				.slice(0, indexSolution)
				.join(' ');
			const suffixQuestion = context.testsDatas[id].list_words
				.slice(indexSolution + 1)
				.join(' ');
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

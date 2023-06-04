import { useContext, useEffect } from 'react';
import { Lottie } from 'components';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';
function TestById() {
	const router = useRouter();

	const context = useContext(DataTestsContext);
	const findIndexUserRecently = (question: { user_answer: undefined }) => {
		return question.user_answer === undefined;
	};
	useEffect(() => {
		if (!router.isReady) return;
		const { testId } = router.query;
		const getData = async () => {
			let indexQuestion;
			if (testId) {
				const testsData = await context.addTestsDataById(
					testId as never,
				);
				indexQuestion = testsData?.findIndex(findIndexUserRecently);

				if (indexQuestion === -1) indexQuestion = 0;
			}

			router.replace(`/tests/${testId}/${indexQuestion}`);
		};
		getData();
	}, [router.isReady]);

	return (
		<Lottie
			width={500}
			height={500}
			animationData={'/lottiejson/quiz-bump.json'}
		></Lottie>
	);
}

export default TestById;

import { useContext, useEffect } from 'react';
import { LottieQuizBump } from 'components';
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

	return <LottieQuizBump width={500} height={500}></LottieQuizBump>;
}

export default TestById;

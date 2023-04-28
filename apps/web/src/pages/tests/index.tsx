import { useContext, useEffect } from 'react';
import { LottieQuizBump } from 'components';
import router from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';
import { withAuth } from 'utils';

function Tests() {
	const context = useContext(DataTestsContext);
	const handleAddTestsData = async () => {
		const testId = await context.addTestsData();
		router.replace(`/tests/${testId}/0`);
	};

	useEffect(() => {
		handleAddTestsData();
	}, []);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center space-y-5">
			<LottieQuizBump width={500} height={500}></LottieQuizBump>
		</div>
	);
}

export default withAuth(Tests);

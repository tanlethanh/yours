import { FC, useContext, useState } from 'react';
import { Lottie, QuestionCard } from 'components';
import Link from 'next/link';
import { DataTestsContext } from 'state/DataTestsContext';
import { TestLayout, withAuth } from 'utils';

interface Props {
	testId: string;
	questionId: string;
}

const TestPage: FC<Props> = ({ testId, questionId }) => {
	const [isFinal, setIsFinal] = useState(false);
	const context = useContext(DataTestsContext);
	const score =
		Math.floor(
			((context.countCorrect * 1.0) / context.testsDatas.length) * 1000,
		) / 100;
	const isFail = score < 7;

	return (
		<TestLayout title={isFinal ? 'Kết quả' : 'Bài kiểm tra'}>
			<>
				<QuestionCard
					key={questionId as never}
					testId={testId as never}
					id={questionId as never}
					setFinal={setIsFinal}
				/>
				{isFinal && (
					<div
						className={
							'flex flex-wrap justify-center items-center ' +
							(isFail ? 'flex-row-reverse' : 'flex-row')
						}
					>
						<div className="flex flex-col space-y-16 pt-10 w-[400px] justify-center items-center">
							<div>
								<h1 className="text-2xl font-medium mb-2">
									Điểm số
								</h1>
								<p className="text-6xl">{score}</p>
								<h1 className="text-2xl font-medium mb-2 mt-6">
									Số câu đúng
								</h1>
								<p className="text-6xl">{`${context.countCorrect}/${context.testsDatas.length}`}</p>
							</div>
							<Link
								href={'/dashboard'}
								className="w-fit px-8 py-3 border border-gray-300 rounded-md"
							>
								Về trang chính
							</Link>
						</div>
						<div>
							{isFail ? (
								<Lottie
									width={400}
									height={400}
									animationData={'/fail.json'}
								></Lottie>
							) : (
								<Lottie
									width={400}
									height={400}
									animationData={'/champion.json'}
								></Lottie>
							)}
						</div>
					</div>
				)}
			</>
		</TestLayout>
	);
};

export default withAuth(TestPage);

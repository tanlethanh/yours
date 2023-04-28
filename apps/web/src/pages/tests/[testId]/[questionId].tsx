import React, { useContext, useState } from 'react';
import { QuestionCard, LottieFail, LottieCongrats } from 'components';
import { useRouter } from 'next/router';
import { withAuth, TestLayout } from 'utils';
import { DataTestsContext } from 'state/DataTestsContext';
import Link from 'next/link';

function TestPage() {
    const router = useRouter();
    const { testId, questionId } = router.query;
    const [isFinal, setIsFinal] = useState(false);
    const context = useContext(DataTestsContext);
    const score = Math.floor(((context.countCorrect * 1.0) / context.testsDatas.length) * 1000) / 100;
    const isFail = score < 7;

    return (
        <TestLayout title={isFinal ? 'Kết quả' : 'Bài kiểm tra'}>
            <QuestionCard
                key={questionId}
                testId={testId}
                id={questionId}
                dataTest={context.testsDatas}
                setFinal={setIsFinal}
            />
            {isFinal && (
                <div
                    className={
                        'flex flex-wrap justify-center items-center ' + (isFail ? 'flex-row-reverse' : 'flex-row')
                    }
                >
                    <div className="flex flex-col space-y-16 pt-10 w-[400px] justify-center items-center">
                        <div>
                            <h1 className="text-2xl font-medium mb-2">Điểm số</h1>
                            <p className="text-6xl">{score}</p>
                            <h1 className="text-2xl font-medium mb-2 mt-6">Số câu đúng</h1>
                            <p className="text-6xl">{`${context.countCorrect}/${context.testsDatas.length}`}</p>
                        </div>
                        <Link href={'/dashboard'} className="w-fit px-8 py-3 border border-gray-300 rounded-md">
                            {' '}
                            Về trang chính
                        </Link>
                    </div>
                    <div>
                        {isFail ? (
                            <LottieFail width={400} height={400}></LottieFail>
                        ) : (
                            <LottieCongrats width={400} height={400}></LottieCongrats>
                        )}
                    </div>
                </div>
            )}
        </TestLayout>
    );
}

export default withAuth(TestPage);

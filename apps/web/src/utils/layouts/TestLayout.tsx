import { useContext, useEffect, useState } from 'react';
import { Lottie } from 'components';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DataTestsContext } from 'state/DataTestsContext';

export function TestLayout({
	children,
	title,
}: {
	children: React.ReactElement;
	title: string;
}) {
	const router = useRouter();
	const [statusLoading, setStatusLoading] = useState(true);
	const context = useContext(DataTestsContext);

	useEffect(() => {
		if (!router.isReady) return;
		const getData = async () => {
			if (!children?.props?.dataTest) {
				const { testId } = router.query;
				if (testId) {
					const testDatas = await context.addTestsDataById(
						testId as string,
					);

					if (testDatas === undefined) {
						setStatusLoading(false);
						handleLoading();
					}
				}
			}
		};
		getData();
	}, []);
	const handleLoading = () => {
		setTimeout(() => {
			router.replace('/dashboard');
		}, 1000);
	};
	return (
		<>
			{statusLoading ? (
				<AnimatePresence>
					<div className="w-screen min-h-screen flex flex-col items-center mt-20">
						<Head>
							<title>Sipo English | Practice</title>
						</Head>
						<h1 className="font-medium text-3xl mb-10">
							{title ? title : 'Bài kiểm tra'}
						</h1>
						<div>{children}</div>
					</div>
				</AnimatePresence>
			) : (
				<Lottie
					width={500}
					height={500}
					animationData={'/lottiejson/loadingErrorGetTestById.json'}
				></Lottie>
			)}
		</>
	);
}

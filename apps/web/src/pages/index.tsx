import resources from 'assets/resources.json';
import { Lottie } from 'components/lottie';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MainLayout } from 'utils';

const Home: NextPage = () => {
	const router = useRouter();

	const goToNextPage = () => {
		router.push('/login');
	};

	return (
		<MainLayout withHeader={true}>
			<Head>
				<title>Sipo English</title>
			</Head>
			<div className="flex flex-row flex-wrap justify-around items-center mt-24 gap-y-60">
				<div className="max-w-[550px]">
					<h1 className="text-6xl font-semibold text-zinc-800">
						Sipo English
					</h1>
					<p className="italic text-lg mt-6 text-zinc-500">
						{resources.homePage.description}
					</p>
					<div className="mt-28 flex flex-row justify-end space-x-4">
						<button
							className="w-fit px-8 py-3 border border-gray-300 rounded-md hover:bg-zinc-100"
							onClick={goToNextPage}
						>
							{"Let's go"}
						</button>
					</div>
				</div>
				<div className="lg:visible md:invisible rounded-full">
					<Lottie
						animationData={require('assets/lottiejson/finishig-studies.json')}
						width={500}
						height={500}
					/>
				</div>
			</div>
		</MainLayout>
	);
};

export default Home;

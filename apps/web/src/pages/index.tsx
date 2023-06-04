import resources from 'assets/resources.json';
import { Lottie } from 'components';
import Button from 'components/Button';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MainLayout } from 'utils';

const Home: NextPage = () => {
	const router = useRouter();

	return (
		<MainLayout withHeader={true} className="overflow-y-hidden">
			<Head>
				<title>{"Yours - It's mine"}</title>
			</Head>

			<div className="relative bg-red-500">
				<div className="absolute left-0 right-0 ml-auto mr-auto">
					<Lottie
						height={'100%'}
						width={'100%'}
						animationData={'lottiejson/solar-system.json'}
					/>
				</div>
			</div>

			<div className="flex flex-col items-center mt-20 relative z-10">
				<h1 className="text-[80px] text-mainText font-extrabold text-center leading-tight">
					Take your things
				</h1>
				<p className="italic text-lg text-auxText mt-10 mb-24">
					{resources.homePage.description}
				</p>
				<Button
					title="Let's go"
					onClick={() => router.push('/login')}
				/>
			</div>
		</MainLayout>
	);
};

export default Home;

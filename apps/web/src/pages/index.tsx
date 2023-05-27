import resources from 'assets/resources.json';
import Button from 'components/Button';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MainLayout } from 'utils';

const Home: NextPage = () => {
	const router = useRouter();

	return (
		<MainLayout withHeader={true}>
			<Head>
				<title>{"Yours - It's mine"}</title>
			</Head>
			<div className="flex flex-col items-center gap-16 mt-20">
				<h1 className="text-[100px] text-mainText font-extrabold text-center leading-tight">
					Take your things
				</h1>
				<p className="italic text-lg text-auxText">
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

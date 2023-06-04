import { useEffect, useState } from 'react';
import { apiAxios } from '@yours/configs';
import { Lottie } from 'components';
import { useRouter } from 'next/router';

const PracticeBlock = () => {
	const router = useRouter();
	const [connLoading, setConnLoading] = useState(true);
	const [isNotionConnected, setIsNotionConnected] = useState(false);

	const checkConnectToNotion = async () => {
		const { data } = await apiAxios.get('/users/notion-connect');
		console.log(data.is_connected);
		setConnLoading(false);
		setIsNotionConnected(data.is_connected);
	};

	const newTest = () => {
		router.replace('/tests');
	};

	const connectNotion = () => {
		router.push(process.env.NEXT_PUBLIC_AUTHORIZATION_URL as string);
	};

	useEffect(() => {
		checkConnectToNotion();
	}, []);

	return (
		<div className="w-[300px]">
			<div className="">
				{!connLoading ? (
					isNotionConnected ? (
						<div className="flex flex-col space-y-4 items-center">
							<h1 className="text-xl font-medium text-zinc-700">
								Practice
							</h1>
							<button
								className="w-fit px-8 py-3 border border-gray-300 rounded-md"
								onClick={newTest}
							>
								Test now!
							</button>
							<Lottie
								height={280}
								width={280}
								animationData={'/lottiejson/online-test.json'}
							/>
						</div>
					) : (
						<div className="flex flex-col space-y-4">
							<h1>Your account need to connect with Notion</h1>
							<button
								className="w-fit px-8 py-3 border border-gray-300 rounded-md"
								onClick={connectNotion}
							>
								Connect Notion
							</button>
						</div>
					)
				) : (
					<Lottie
						height={80}
						width={80}
						animationData={'/lottiejson/loading.json'}
					/>
				)}
			</div>

			<div className="w-full mt-8 flex flex-col justify-center items-center space-y-4"></div>
		</div>
	);
};

export default PracticeBlock;

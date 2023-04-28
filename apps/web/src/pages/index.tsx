import { LottieStudents } from 'components/lottie';
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
						{'"Ứng dụng học tiếng Anh không dành cho người lười!"'}
					</p>
					<p className="text-lg mt-10 text-zinc-700">
						<span className="font-bold">Sipo English</span> là một
						công cụ hỗ trợ luyện tập và ghi nhớ tiếng Anh, tạo ra
						các bộ câu hỏi như trắc nghiệm, điền khuyết, hay dịch
						câu từ chính{' '}
						<span className="font-bold">ghi chú của bạn</span> trên{' '}
						<span className="font-bold">Notion</span>.
					</p>
					<div className="mt-28 flex flex-row justify-end space-x-4">
						<button className="w-fit px-8 py-3 border border-gray-300 rounded-md text-white bg-zinc-800 hover:bg-zinc-600">
							Câu chuyện Sipo
						</button>
						<button
							className="w-fit px-8 py-3 border border-gray-300 rounded-md hover:bg-zinc-100"
							onClick={goToNextPage}
						>
							Dùng ngay
						</button>
					</div>
				</div>
				<div className="lg:visible md:invisible rounded-full">
					{/* <Image
                        src={illustration}
                        alt=""
                        // className="w-full h-[1000px] lg:object-cover object-contain "
                        width={500}
                        height={500}
                    /> */}
					<LottieStudents width={500} height={500}></LottieStudents>
				</div>
			</div>
		</MainLayout>
	);
};

export default Home;

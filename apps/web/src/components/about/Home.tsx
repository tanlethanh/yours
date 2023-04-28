import illustration from 'assets/illustration.svg';
import Image from 'next/image';

export const Home = () => {
	return (
		<div className="w-full px-6 h-[848px] mt-28 bg-black">
			<div className="h-[824px] bg-white rounded-3xl lg:grid lg:grid-cols-2 flex items-center ">
				<div className="mx-[70px] flex  flex-col justify-center items-start">
					<h1 className="md:text-[86px] lg:text-[92px] text-[80px] leading-[112px]  ">
						There is a better way to learn English{' '}
					</h1>
					<div className=" rounded-full border-solid border-2 border-black mt-16 px-4 py-2 flex justify-between items-center ">
						<span className="text-black">{"Let's conect"}</span>
					</div>
				</div>

				<div className="image lg:width-full lg:relative lg:right-0 lg:mg-0 lg:opacity-100">
					<Image
						src={illustration}
						alt=""
						className="w-full h-[1000px] lg:object-cover object-contain "
					/>
				</div>
			</div>
		</div>
	);
};

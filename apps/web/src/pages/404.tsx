import { Lottie } from 'components';
import Link from 'next/link';

export default function NotFoundPage() {
	return (
		<div className="h-screen w-screen flex flex-col items-center mt-20">
			<Lottie
				width={500}
				height={500}
				animationData={'/404-page-animation.json'}
			></Lottie>
			<Link
				href={'/'}
				className="w-fit px-8 py-3 border border-gray-300 rounded-md"
				title="Go back"
			/>
		</div>
	);
}

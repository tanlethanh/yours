import { Lottie } from 'components';

export function Loading() {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<Lottie animationData={'/lottiejson/loading.json'} />
		</div>
	);
}

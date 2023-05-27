import { Lottie } from 'components/lottie';

export function Loading() {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<Lottie animationData={require('assets/lottiejson/loading.json')} />
		</div>
	);
}

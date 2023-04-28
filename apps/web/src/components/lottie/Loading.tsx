import Lottie from 'react-lottie';

import animationData from './lottiejson/loading.json';

export function LottieLoading({ width = 130, height = 130 }) {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		renderer: 'svg',
	};
	return <Lottie options={defaultOptions} height={height} width={width} />;
}

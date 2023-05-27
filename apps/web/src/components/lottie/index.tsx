import { type FC } from 'react';
import PureLottie, { type Options } from 'react-lottie';

interface Props {
	width?: number;
	height?: number;
	animationData: unknown;
	options?: Options;
}

export const Lottie: FC<Props> = ({
	height = 130,
	width = 130,
	animationData,
	options = {},
}) => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		renderer: 'svg',
	};
	return (
		<PureLottie
			options={{ ...defaultOptions, ...options }}
			height={height}
			width={width}
		/>
	);
};

export * from './Congrats';
export * from './Fail';
export * from './HutBanner';
export * from './Loading';
export * from './NotFound';
export * from './OnlineTest';
export * from './QuizBump';
export * from './Students';
export * from './TestError';

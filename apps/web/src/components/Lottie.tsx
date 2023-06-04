import { type FC, Fragment, useEffect, useState } from 'react';
import PureLottie, { type Options } from 'react-lottie';
import axios from 'axios';

interface Props {
	width?: number | string;
	height?: number | string;
	animationData: unknown;
	options?: Partial<Options>;
	clientLoad?: boolean;
}

export const Lottie: FC<Props> = ({
	height = 130,
	width = 130,
	animationData,
	options = {},
	clientLoad = true,
}) => {
	const [data, setData] = useState(!clientLoad ? animationData : null);

	useEffect(() => {
		if (clientLoad) {
			axios.get(String(animationData)).then((res) => {
				console.log(res.data);
				setData(res.data);
			});
		}
	}, []);

	const defaultOptions = {
		loop: true,
		autoplay: true,
		renderer: 'svg',
	};
	return (
		<Fragment>
			{data ? (
				<PureLottie
					options={{
						...defaultOptions,
						...options,
						animationData: data,
					}}
					height={height}
					width={width}
				/>
			) : (
				<div> Not found data </div>
			)}
		</Fragment>
	);
};

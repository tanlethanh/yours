import { useEffect, useState } from 'react';

export const useViewport = () => {
	const [width, setWidth] = useState(
		typeof window == 'undefined' ? null : window.innerWidth,
	);

	useEffect(() => {
		if (typeof window == 'undefined') return;
		const handleResize = () => setWidth(window.innerWidth);

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return { width };
};

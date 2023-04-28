import React from 'react';
import { motion } from 'framer-motion';

function PrimaryButton({
	onClick,
	animate,
	children,
}: {
	onClick: Function;
	animate: object;
	children: React.ReactNode;
}) {
	return (
		<motion.button
			className="border rounded-lg p-2 px-10 w-fit border-black"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.9 }}
			onClick={(e) => {
				if (typeof onClick == 'function') {
					onClick(e);
				}
			}}
			animate={animate}
			initial={false}
		>
			{children}
		</motion.button>
	);
}

export { PrimaryButton };

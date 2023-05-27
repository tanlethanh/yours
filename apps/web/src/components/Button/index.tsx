import { type ButtonHTMLAttributes, type FC } from 'react';
import { motion } from 'framer-motion';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
}

const Button: FC<Props> = ({ title, className, ...props }) => {
	return (
		<motion.div
			className="gradientPrimary rounded-md p-[1.8px]"
			whileHover={{
				scale: 1.1,
			}}
		>
			<button
				className={
					'w-fit px-8 py-3 text-mainText bg-primary rounded-md ' +
					className
				}
				{...props}
			>
				{title}
			</button>
		</motion.div>
	);
};

export default Button;

export { Button };
export * from './PrimaryButton';

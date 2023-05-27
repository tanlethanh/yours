import { type ButtonHTMLAttributes, type FC } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
}

const Button: FC<Props> = ({ title, className, ...props }) => {
	return (
		<button
			className={
				'w-fit px-8 py-3 border border-gray-300 rounded-md text-mainText hover:bg-white hover:text-black ' +
				className
			}
			{...props}
		>
			{title}
		</button>
	);
};

export default Button;

export { Button };
export * from './PrimaryButton';

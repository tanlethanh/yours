import { type FC, type HtmlHTMLAttributes } from 'react';
import { Header } from 'components';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
	withHeader: boolean;
}

export const MainLayout: FC<Props> = ({
	children,
	withHeader = true,
	className,
	...props
}) => {
	return (
		<div
			className={
				'flex min-h-screen min-w-screen items-center flex-col px-10 pt-0 pb-40 bg-primary' +
				(className ? ` ${className}` : '')
			}
			{...props}
		>
			{withHeader && (
				<div className="w-full h-16">
					<Header />
				</div>
			)}
			<div className="w-full">
				<div className="max-w-[1200px] m-auto">{children}</div>
			</div>
		</div>
	);
};

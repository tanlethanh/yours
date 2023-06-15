import { type FC, type HtmlHTMLAttributes } from 'react';
import { Header } from 'components';
import { merge } from 'utils';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
	withHeader: boolean;
	headerClassName?: string;
}

export const MainLayout: FC<Props> = ({
	withHeader = true,
	headerClassName = 'text-mainText',
	children,
	className,
	...props
}) => {
	const defaultClassname =
		'flex min-h-screen min-w-screen items-center flex-col px-10 pt-0 pb-40 bg-primary';

	return (
		<div className={merge([defaultClassname, className])} {...props}>
			{withHeader && (
				<div className="w-full h-16">
					<Header className={headerClassName} />
				</div>
			)}
			<div className="w-full">
				<div className="max-w-[1200px] m-auto">{children}</div>
			</div>
		</div>
	);
};

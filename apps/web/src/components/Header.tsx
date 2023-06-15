import { type FC, type HtmlHTMLAttributes } from 'react';
import { firebaseAuth } from '@yours/configs';
import Image from 'next/image';
import Link from 'next/link';
import { merge } from 'utils';
import { useAuth } from 'utils/hooks/useAuth';

type Props = HtmlHTMLAttributes<HTMLDivElement>;

export const Header: FC<Props> = ({ className }) => {
	const { user, loading } = useAuth();

	const logOut = async () => {
		await firebaseAuth.signOut();
	};

	const defaultClassname =
		'max-w-[1200px] m-auto flex flex-row items-center justify-between mt-4';

	return (
		<div className={merge([defaultClassname, className])}>
			<Link className="text-2xl font-semibold" href={'/'}>
				Yours
			</Link>
			{!loading && user ? (
				<Link
					className="flex flex-row space-x-4 justify-center items-center"
					href={'/english-app/dashboard'}
				>
					<div>
						<h1 className="text-md font-normal">
							{user?.displayName}
						</h1>
						<p
							className="text-[11px] underline-offset-1 underline"
							onClick={logOut}
						>
							Log out
						</p>
					</div>
					<Image
						src={user?.photoURL || ''}
						width={38}
						height={38}
						alt="Avt"
						priority
						className="rounded-full"
					></Image>
				</Link>
			) : (
				<Link href={'/login'}> Sign in </Link>
			)}
		</div>
	);
};

import { useEffect, useState } from 'react';
import { firebaseAuth } from '@yours/configs';
import resources from 'assets/resources.json';
import { Loading } from 'components';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from 'utils';

function Login() {
	const googleProvider = new GoogleAuthProvider();
	const router = useRouter();
	const { user, loading } = useAuth();
	const [render, setRender] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (user) {
				// User is signed in.
				console.log('User is currently logged in');
				if (!router.query.redirect) {
					router.push('/english-app/dashboard');
				} else {
					router.push(router.query.redirect as string);
				}
			} else {
				// No user is signed in.
				console.log('No user is currently logged in');
				setRender(true);
			}
		}
	}, [user, loading]);

	const sighInGoogleOnclick = async () => {
		try {
			await signInWithPopup(firebaseAuth, googleProvider);
		} catch (error) {
			console.log('Sign in error', error);
		}
	};

	return render ? (
		<div className="flex flex-col min-h-screen justify-center items-center space-y-5">
			<Head>
				<title>Sipo English | Sign in</title>
			</Head>
			<div className="h-[500px] w-[500px] flex flex-col item-centers space-y-10">
				<h1 className="text-5xl font-semibold">Sign in</h1>
				<div className="flex flex-col space-y-4 min-h-[40%]">
					<button
						className="w-fit px-8 py-3 border border-gray-300 rounded-md flex flex-row justify-center items-center"
						onClick={sighInGoogleOnclick}
					>
						<Image
							src={'/google.png'}
							alt="Gg"
							width={20}
							height={20}
							className="mr-2"
						></Image>
						Continue with Google
					</button>
				</div>
				<p className="text-zinc-500 text-center">
					{resources.loginPage.terms}
				</p>
			</div>
		</div>
	) : (
		<Loading></Loading>
	);
}

export default Login;

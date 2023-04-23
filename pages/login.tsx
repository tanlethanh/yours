import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';
import Head from 'next/head';
import Loading from '../components/loading';

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
                    router.replace('/dashboard');
                } else {
                    router.replace(router.query.redirect as string);
                }
            } else {
                // No user is signed in.
                console.log('No user is currently logged in');
                setRender(true);
            }
        }
    }, [user, loading]);

    const sighInGoogleOnclick = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(result);
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
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
                        <Image src={'/google.png'} alt="Gg" width={20} height={20} className="mr-2"></Image>
                        Continue with Google
                    </button>
                </div>
                <p className="text-zinc-500 text-center">
                    By clicking “Continue with Google" above, you acknowledge that you have read and understood, and
                    agree to Sipo English's Terms & Conditions and Privacy Policy
                </p>
            </div>
        </div>
    ) : (
        <Loading></Loading>
    );
}

export default Login;

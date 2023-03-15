import React, { useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useRouter } from 'next/router'

function Login() {
    const googleProvider = new GoogleAuthProvider()
    const router = useRouter()

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log('User is currently logged in')
                if (!router.query.redirect) {
                    router.replace('/')
                } else {
                    router.replace(router.query.redirect as string)
                }
            } else {
                // No user is signed in.
                console.log('No user is currently logged in')
            }
        })
    }, [])

    const sighInGoogleOnclick = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result)
                const token = credential?.accessToken
                // The signed-in user info.
                const user = result.user
                console.log(result)
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code
                const errorMessage = error.message
                // The email of the user's account used.
                const email = error.customData.email
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error)
            })
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center space-y-5">
            <div className="h-[500px] w-[400px] flex flex-col item-centers space-y-10">
                <h1 className="text-5xl font-semibold">Sign in</h1>
                <div className="flex flex-col space-y-4 min-h-[50%]">
                    <button
                        className="w-fit px-8 py-3 border border-gray-300 rounded-md"
                        onClick={sighInGoogleOnclick}
                    >
                        Continue with Google
                    </button>
                </div>
                <p className="text-gray-400 h text-center">
                    By clicking “Continue with Google" above, you acknowledge
                    that you have read and understood, and agree to Sipo
                    English's Terms & Conditions and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Login

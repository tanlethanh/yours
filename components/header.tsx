import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../firebaseConfig';

export default function Header() {
    const { user, loading } = useAuth();

    useEffect(() => {}, [user, loading]);

    const logOut = async () => {
        await auth.signOut();
    };

    return (
        <div className="max-w-[1200px] h-full m-auto flex flex-row items-center justify-between border-b-zinc-300 border-b-2">
            <Link className="text-2xl font-medium" href={'/'}>
                Sipo English
            </Link>
            {!loading && user ? (
                <Link className="flex flex-row space-x-4 justify-center items-center" href={'/dashboard'}>
                    <h1 className="text-md font-normal">{user?.displayName}</h1>
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
                <Link href={'/login'}> Đăng nhập </Link>
            )}
        </div>
    );
}

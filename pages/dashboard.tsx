import React, { useEffect, useState } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';
import { apiAxios } from '../utils/axiosConfig';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig';
import Head from 'next/head';
import MainLayout from '../layouts/mainLayout';

function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [connLoading, setConnLoading] = useState(true);
    const [isNotionConnected, setIsNotionConnected] = useState(false);

    const checkConnectToNotion = async () => {
        const { data } = await apiAxios.get('/users/notion-connect');
        console.log(data.is_connected);
        setIsNotionConnected(data.is_connected);
        setConnLoading(true);
    };

    const newTest = () => {
        router.replace('/tests');
    };

    const connectNotion = () => {
        router.push(process.env.NEXT_PUBLIC_AUTHORIZATION_URL as any);
    };

    const logOut = async () => {
        await auth.signOut();
    };

    useEffect(() => {
        checkConnectToNotion();
    }, []);

    return (
        <MainLayout withHeader={true}>
            <div className="flex min-h-screen min-w-screen items-center justify-center flex-col p-10">
                <Head>
                    <title>Sipo English | Dashboard</title>
                </Head>
                <div className="max-w-[800px] min-h-[500px]">
                    <div className="flex flex-row space-x-2 justify-center items-center mb-10">
                        <Image
                            src={user?.photoURL || ''}
                            width={35}
                            height={35}
                            alt="Avt"
                            priority
                            className="rounded-full"
                        ></Image>
                        <h1 className="text-lg font-normal">{user?.displayName}</h1>
                        <button className="text-sm text-zinc-800 underline-offset-2 underline" onClick={logOut}>
                            Log out
                        </button>
                    </div>

                    <div className="">
                        {connLoading ? (
                            isNotionConnected ? (
                                <div className="flex flex-col space-y-4">
                                    <h1>Làm bài kiểm tra ngay</h1>
                                    <button
                                        className="w-fit px-8 py-3 border border-gray-300 rounded-md"
                                        onClick={newTest}
                                    >
                                        Luyện tập ngay
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4">
                                    <h1>Tài khoản của bạn cần kết nối với Notion</h1>
                                    <button
                                        className="w-fit px-8 py-3 border border-gray-300 rounded-md"
                                        onClick={connectNotion}
                                    >
                                        Kết nối Notion
                                    </button>
                                </div>
                            )
                        ) : (
                            'Loading ...'
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default withAuth(Dashboard);

import React, { useEffect, useState } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';
import { apiAxios } from '../utils/axiosConfig';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig';
import Head from 'next/head';
import MainLayout from '../layouts/mainLayout';
import { LineChart } from '../components/lineChart';
import CongratsElement from '../components/animatedElements/congratsElement';
import LoadingElement from '../components/animatedElements/loadingElement';
import OnlineTestElement from '../components/animatedElements/onlineTestElement';

function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [connLoading, setConnLoading] = useState(true);
    const [isNotionConnected, setIsNotionConnected] = useState(false);

    const checkConnectToNotion = async () => {
        const { data } = await apiAxios.get('/users/notion-connect');
        console.log(data.is_connected);
        setConnLoading(false);
        setIsNotionConnected(data.is_connected);
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
            <div className="flex flex-row flex-wrap justify-around gap-y-6 pt-8">
                <Head>
                    <title>Sipo English | Dashboard</title>
                </Head>
                <div className="w-[300px]">
                    <div className="">
                        {!connLoading ? (
                            isNotionConnected ? (
                                <div className="flex flex-col space-y-4 items-center">
                                    <h1 className="text-xl font-medium text-zinc-700">Luyện tập</h1>
                                    <button
                                        className="w-fit px-8 py-3 border border-gray-300 rounded-md"
                                        onClick={newTest}
                                    >
                                        Kiểm tra từ vựng
                                    </button>
                                    <div>
                                        <OnlineTestElement width={280} height={280}></OnlineTestElement>
                                    </div>
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
                            <LoadingElement width={80} height={80}></LoadingElement>
                        )}
                    </div>

                    <div className="w-full mt-8 flex flex-col justify-center items-center space-y-4"></div>
                </div>
                <div className="md:w-[700px] h-[400px] sm:w-[430px]">
                    <h1 className="text-xl font-medium text-zinc-700 mb-4">Tiến trình</h1>
                    <LineChart />
                </div>

                <div className="lg:w-[300px] md:w-[300px] sm:w-[430px]">
                    <h1 className="text-xl font-medium text-zinc-700 mb-2">Số liệu câu hỏi</h1>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <th className="px-6 py-2 text-left font-normal">Tổng số câu/từ hiện có</th>
                                <th className="font-normal">200</th>
                            </tr>
                            <tr>
                                <th className="px-6 py-2 text-left font-normal">Tổng số câu/từ đã ôn</th>
                                <th className="font-normal">178</th>
                            </tr>
                            <tr>
                                <th className="px-6 py-2 text-left font-normal">Tổng số lần kiểm tra</th>
                                <th className="font-normal">18</th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="w-[700px]">
                    <h1 className="text-xl font-medium text-zinc-700 mb-2">Tài nguyên học tập</h1>
                    {/* <LineChart /> */}
                    <div>
                        <table className="table-auto">
                            <tbody>
                                <tr className="font-normal">
                                    <th className="px-6 py-2 text-left font-normal">
                                        Notion: Pratice english with Sipo
                                    </th>
                                    <th className="text-right font-normal px-12"> 32 cụm từ </th>
                                    <th className="text-right font-normal">Cập nhật: 20/11</th>
                                </tr>
                                <tr className="">
                                    <th className="px-6 py-2 text-left font-normal">Notion: Luyện ngữ pháp</th>
                                    <th className="text-right font-normal px-12"> 8 cụm từ</th>
                                    <th className="text-right font-normal">Cập nhật: 20/11</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default withAuth(Dashboard);

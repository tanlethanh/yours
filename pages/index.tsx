import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {
    MultichoiceQuestion,
    FullTextQuestion,
    HalfTextQuestion,
} from '../components/question-card'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
    const router = useRouter()

    const goToNextPage = () => {
        router.push('/login')
    }

    return (
        <div className="flex min-h-screen min-w-screen items-center justify-center flex-col p-10">
            <div className="max-w-[800px] min-h-[500px]">
                <h1 className="text-6xl font-semibold">Sipo English</h1>
                <p className="italic text-lg mt-6 text-zinc-500">
                    "Ứng dụng học tiếng Anh không dành cho người lười!"
                </p>
                <p className="text-lg mt-10">
                    <span className="font-bold">Sipo English</span> là một công
                    cụ hỗ trợ luyện tập và ghi nhớ tiếng Anh, tạo ra các bộ câu
                    hỏi như trắc nghiệm, điền khuyết, hay dịch câu từ chính{' '}
                    <span className="font-bold">ghi chú của bạn</span> trên{' '}
                    <span className="font-bold">Notion</span>.
                </p>
                <div className="mt-20 flex flex-row justify-end space-x-4">
                    <button className="w-fit px-8 py-3 border border-gray-300 rounded-md text-white bg-zinc-800 hover:bg-zinc-600">
                        Câu chuyện Sipo
                    </button>
                    <button
                        className="w-fit px-8 py-3 border border-gray-300 rounded-md hover:bg-zinc-100"
                        onClick={goToNextPage}
                    >
                        Dùng ngay
                    </button>
                </div>
                {/* <Link
                    href={
                        process.env.AUTHORIZATION_URL
                            ? process.env.AUTHORIZATION_URL.toString()
                            : '/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Add to Notion
                </Link>
                <Link href="/login">Go to Login</Link> */}
            </div>
        </div>
    )
}

export default Home

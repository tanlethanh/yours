import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {
    MultichoiceQuestion,
    FullTextQuestion,
    HalfTextQuestion,
} from '../components/question-card'

const Home: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-xl mb-10 font-bold">Xin chào các bạn</h1>
        </div>
    )
}

export default Home

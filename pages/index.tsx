import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {
    MultichoiceQuestion,
    FullTextQuestion,
    HalfTextQuestion,
} from '../components/question-card'
import Link from 'next/link'

const Home: NextPage = () => {
    return (
        <div className="flex h-screen w-screen items-center justify-center flex-col">
            <h1 className="text-3xl">Hello world</h1>
            <a target="_blank" href={process.env.AUTHORIZATION_URL?.toString()}>
                Add to Notion
            </a>
            <Link href="/login">
                Go to Login
            </Link>
        </div>
    )
}

export default Home


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
        <div className="flex h-screen w-screen items-center justify-center flex-col">
            <h1 className="text-3xl">Hello world</h1>
            <a target="_blank" href={process.env.AUTHORIZATION_URL?.toString()}>
                Add to Notion
            </a>
        </div>
    )
}

export default Home

// export async function getStaticProps() {
//     return {
//         AUTHORIZATION_URL: process.env.AUTHORIZATION_URL,
//         OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
//         OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
//     }
// }

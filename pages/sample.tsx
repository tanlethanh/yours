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

            <MultichoiceQuestion
                question="Fence?"
                hint="Hello guy"
                answers={[
                    {
                        text: 'Hello my name is Tan',
                        isSolution: true,
                    },
                    {
                        text: 'Hello my name is Nhi',
                    },
                    {
                        text: 'Hello my name is Tan',
                    },
                    {
                        text: 'Xin chao tat ca cac ban',
                    },
                ]}
                updateNumberCorrect={undefined}
                title={'Hello'}
                next={() => {}}
            />

            <FullTextQuestion
                title="Full text question"
                question={'Bạn có thích tôi không?'}
                solution={'Tất nhiên rồi bạn'}
                hint={''}
                next={() => {}}
            />

            <HalfTextQuestion
                title="Half text question"
                prefixQuestion="Anh có"
                suffixQuestion="em không!"
                hint=""
                solution="yêu"
                next={() => {}}
            ></HalfTextQuestion>

            {/* <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer> */}
        </div>
    )
}

export default Home

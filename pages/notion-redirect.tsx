import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

function RedirectPage() {
    const router = useRouter()
    const { query } = router

    const base64encodedData = new Buffer(
        process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID +
            ':' +
            process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID
    ).toString('base64')

    useEffect(() => {
        if (!router.isReady) return

        const fetchData = async () => {
            console.log('Query string: ', query.code)
            const res = await axios.post(
                `api/v1/notion/auth?code=${query.code}`
            )
            console.log(res)
        }
        fetchData()
    }, [router.isReady])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl">RedirectPage</h1>
            <p>{query.code}</p>
        </div>
    )
}

export default RedirectPage

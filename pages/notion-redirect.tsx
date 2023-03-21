import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
// import axios from 'axios'
import { apiAxios } from '../utils/axiosConfig'
import { withAuth } from '../components/withAuth'

function RedirectPage() {
    const router = useRouter()
    const { query } = router
    const dataFetchedRef = useRef(false)

    const fetchData = async () => {
        const res = await apiAxios.post(`notion/auth?code=${query.code}`)
        console.log(res)

        router.push('/tests')
    }

    useEffect(() => {
        if (!router.isReady || dataFetchedRef.current) return
        dataFetchedRef.current = true
        try {
            fetchData()
        } catch (error) {
            console.log('Something wrong')
            console.log(error)
        }
    }, [router.isReady])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl">RedirectPage</h1>
            <p>{query.code}</p>
        </div>
    )
}

export default withAuth(RedirectPage)

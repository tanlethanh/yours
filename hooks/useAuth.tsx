import { useState, useEffect, useLayoutEffect } from 'react'
import { auth } from '../firebaseConfig'

export function useAuth() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState<Boolean>(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return { user, loading }
}

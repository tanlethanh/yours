import React from 'react'
import { AnimatePresence } from 'framer-motion'

function TestLayout({ children }) {
    return (
        <AnimatePresence>
            <div className="w-screen min-h-screen flex flex-col justify-center items-center">
                <h1 className="font-medium text-3xl mb-6">English test</h1>
                <div>{children}</div>
            </div>
        </AnimatePresence>
    )
}

export default TestLayout

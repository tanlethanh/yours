import React from 'react'
import { MultichoiceQuestion } from '.'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

function QuestionCard({ testId, id }) {
    const router = useRouter()

    return (
        <>
            <MultichoiceQuestion
                key={id}
                title={`Question ${id}`}
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
                next={() => {
                    router.push(`/tests/${testId}/${Number(id) + 1}`)
                }}
            />
        </>
    )
}

export default QuestionCard

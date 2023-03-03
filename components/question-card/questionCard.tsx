import React from 'react'
import { MultichoiceQuestion } from '.'
import { useRouter } from 'next/router'

function QuestionCard({ testId, id }) {
    
    const router = useRouter()

    return (
        <div>
            QuestionCard
            <h1>
                {' '}
                Test ID {testId} - question ID {id}
            </h1>
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
                next={() => {
                    router.push(`/tests/${testId}/${id + 1}`)
                }}
            />
        </div>
    )
}

export default QuestionCard

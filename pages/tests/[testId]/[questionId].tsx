import React from 'react'
import TestLayout from '../../../layouts/testLayout'
import QuestionCard from '../../../components/question-card/questionCard'
import { useRouter } from 'next/router'
import { withAuth } from '../../../components/withAuth'

function TestPage() {
    const router = useRouter()
    const { testId, questionId } = router.query

    return (
        <TestLayout>
            <QuestionCard testId={testId} id={questionId} />
        </TestLayout>
    )
}

export default withAuth(TestPage)

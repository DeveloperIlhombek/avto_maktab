'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllTests, submitAnswer, Test } from '@/lib/test'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function TestComponent() {
	const [pageNumber, setPageNumber] = useState(0)
	const [questions, setQuestions] = useState<Test[]>([])
	const [answers, setAnswers] = useState<number[]>([])
	const pathname = usePathname()
	const pathuserId = pathname.split('/')[3]
	const lang = pathname.split('/')[1]

	useEffect(() => {
		const fetchQuestions = async () => {
			const data = await getAllTests({
				pageSize: 20,
				pageNumber: pageNumber,
				language: lang,
			})
			if (data) {
				setQuestions(data.items)
				setAnswers(new Array(data.items.length).fill(null))
			}
		}

		fetchQuestions()
	}, [pageNumber, lang])

	const handlePageChange = (newPage: number) => {
		setPageNumber(newPage)
	}

	const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
		const newAnswers = [...answers]
		newAnswers[questionIndex] = answerIndex
		setAnswers(newAnswers)
	}

	const handleSubmit = async () => {
		const userId = pathuserId
		const examTestCases = questions.map((question, index) => ({
			testCaseId: question.id,
			selectedAnswerId: question.testAnswersForUser
				? question.testAnswersForUser[answers[index]]?.id
				: null,
		}))

		// Barcha savollarga javob berilganligini tekshirish
		const allQuestionsAnswered = answers.every(answer => answer !== null)

		if (!allQuestionsAnswered) {
			alert('Iltimos, barcha savollarga javob bering!')
			return
		}

		const submitAnswerResponse = await submitAnswer({
			language: lang,
			userId: userId,
			examTestCases: examTestCases,
		})

		if (submitAnswerResponse.isSuccess) {
			console.log('Answers submitted successfully')
		} else {
			console.error(
				'Failed to submit answers:',
				submitAnswerResponse.errorMessages
			)
		}
	}

	return (
		<>
			<div>
				{questions.map((item, index) => (
					<div key={item.id}>
						<div>{item.question}</div>
						{item.testAnswersForUser?.map((answer, answerIndex) => (
							<div key={answer.id}>
								<Input
									type='radio'
									name={`question-${index}`}
									checked={answers[index] === answerIndex}
									onChange={() => handleAnswerSelect(index, answerIndex)}
								/>
								{answer.answer}
							</div>
						))}
					</div>
				))}
			</div>
			<Button
				onClick={() => handlePageChange(pageNumber - 1)}
				disabled={pageNumber === 0}
			>
				Previous Page
			</Button>
			<Button
				onClick={() => handlePageChange(pageNumber + 1)}
				// disabled={pageNumber === totalPages - 1}
			>
				Next Page
			</Button>
			<Button onClick={handleSubmit} disabled={answers.includes(null)}>
				Submit Answers
			</Button>
		</>
	)
}

export default TestComponent

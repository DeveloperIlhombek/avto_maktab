'use client'

import { useState, useEffect } from 'react'
import { getAllTests, submitAnswer, Test } from '@/lib/test'
import { usePathname } from 'next/navigation'
import { TestQuestion } from './test-question'
import { TestNavigation } from './test-navigation'
import { StartDialog } from './start-dialog'
import { ResultDialog } from './result-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { TestHeader } from './test-header'
///ddd
export default function TestContainer() {
	const [pageNumber, setPageNumber] = useState(0)
	const [questions, setQuestions] = useState<Test[]>([])
	const [answers, setAnswers] = useState<number[]>([])
	const [isStartDialogOpen, setIsStartDialogOpen] = useState(true)
	const [isTestStarted, setIsTestStarted] = useState(false)
	const [isTestCompleted, setIsTestCompleted] = useState(false)
	const [timeLeft, setTimeLeft] = useState(0)
	const [currentQuestion, setCurrentQuestion] = useState(0)

	const [testResults, setTestResults] = useState({
		correctAnswers: 0,
		totalQuestions: 0,
		percentage: 0,
	})
	const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)

	const pathname = usePathname()
	const pathuserId = pathname.split('/')[3]
	const lang = pathname.split('/')[1]

	useEffect(() => {
		if (isTestStarted && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						clearInterval(timer)
						handleTestComplete()
						return 0
					}
					return prev - 1
				})
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [isTestStarted, timeLeft])

	// const handleStartTest = async (questionCount: number) => {
	// 	try {
	// 		const data = await getAllTests({
	// 			pageSize: questionCount,
	// 			pageNumber: 0,
	// 			language: lang,
	// 		})

	// 		if (data) {
	// 			const shuffledQuestions = [...data.items].sort(
	// 				() => 0.5 - Math.random()
	// 			)
	// 			setQuestions(shuffledQuestions)
	// 			setAnswers(new Array(shuffledQuestions.length).fill(null))
	// 			setTimeLeft(questionCount * 30) // 30 seconds per question
	// 			setIsStartDialogOpen(false)
	// 			setIsTestStarted(true)
	// 			setCurrentQuestion(0)
	// 		}
	// 	} catch (error) {
	// 		console.error('Failed to fetch questions:', error)
	// 	}
	// }

	const handleTestComplete = async () => {
		if (isTestCompleted) return

		try {
			const examTestCases = questions.map((question, index) => ({
				testCaseId: question.id,
				selectedAnswerId:
					question.testAnswersForUser?.[answers[index]]?.id || null,
			}))

			const submitAnswerResponse = await submitAnswer({
				language: lang,
				userId: pathuserId,
				examTestCases: examTestCases,
			})

			if (submitAnswerResponse.isSuccess) {
				const correctCount = answers.filter(
					(answer, index) =>
						questions[index].testAnswersForUser?.[answer]?.isCorrect
				).length

				const results = {
					correctAnswers: correctCount,
					totalQuestions: questions.length,
					percentage: (correctCount / questions.length) * 100,
				}

				setTestResults(results)
				setIsTestCompleted(true)
				setIsResultDialogOpen(true)
				setTimeLeft(0)
			} else {
				console.error(
					'Failed to submit answers:',
					submitAnswerResponse.errorMessages
				)
			}
		} catch (error) {
			console.error('Error submitting test:', error)
		}
	}

	const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
		if (isTestCompleted || timeLeft <= 0) return

		const newAnswers = [...answers]
		newAnswers[questionIndex] = answerIndex
		setAnswers(newAnswers)
	}

	const resetTest = () => {
		setCurrentQuestion(0)
		setPageNumber(0)
		setIsTestStarted(false)
		setIsTestCompleted(false)
		setIsResultDialogOpen(false)
		setAnswers([])
		setQuestions([])
		setTestResults({ correctAnswers: 0, totalQuestions: 0, percentage: 0 })
		setIsStartDialogOpen(true)
	}

	// if (!isTestStarted && isStartDialogOpen) {
	// 	return <StartDialog isOpen={isStartDialogOpen} onStart={handleStartTest} />
	// }

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				<TestHeader
					timeLeft={timeLeft}
					totalTime={questions.length * 30}
					onComplete={handleTestComplete}
					isCompleted={isTestCompleted}
					onReset={resetTest}
				/>

				<TestNavigation
					currentQuestion={currentQuestion}
					totalQuestions={questions.length}
					answers={answers}
					isCompleted={isTestCompleted}
					questions={questions}
					onQuestionChange={setCurrentQuestion}
				/>

				<AnimatePresence mode='wait'>
					<motion.div
						key={currentQuestion}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
					>
						{questions[currentQuestion] && (
							<TestQuestion
								question={questions[currentQuestion]}
								selectedAnswer={answers[currentQuestion]}
								onAnswerSelect={answerIndex =>
									handleAnswerSelect(currentQuestion, answerIndex)
								}
								isCompleted={isTestCompleted}
								isDisabled={timeLeft <= 0}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			<ResultDialog
				isOpen={isResultDialogOpen}
				onClose={() => setIsResultDialogOpen(false)}
				onRestart={resetTest}
				results={testResults}
			/>
		</div>
	)
}

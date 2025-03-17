'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllTests, submitAnswer, SubmitAnswerResult } from '@/lib/test'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer } from './timer'
import { redirect, usePathname } from 'next/navigation'

interface TestQuestion {
	id: string
	question: string
	explanation: string
	mediaUrl: string | null
	testAnswersForUser: {
		id: string
		answerText: string
	}[]
}

interface TestPageProps {
	language: string
	userId: string
}

const SECONDS_PER_QUESTION = 90

export function TestPage({ language, userId }: TestPageProps) {
	const [totalQuestions, setTotalQuestions] = useState(20)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [questions, setQuestions] = useState<TestQuestion[]>([])
	const [selectedAnswers, setSelectedAnswers] = useState<
		Record<string, string>
	>({})
	const [timeLeft, setTimeLeft] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)

	const [testResults, setTestResults] = useState<SubmitAnswerResult>()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()

	// Extract the language prefix from the pathname
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		// Check if the first segment after the initial slash is a language code
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						handleFinishTest()
						return 0
					}
					return prev - 1
				})
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [timeLeft])

	useEffect(() => {
		handleStart(20)
	}, [])

	const fetchQuestions = async () => {
		try {
			setIsLoading(true)
			const response = await getAllTests({
				pageSize: 20,
				pageNumber: 0,
				language,
			})

			if (response?.items) {
				setQuestions(response.items)
			}
		} catch (error) {
			console.error('Error fetching questions:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleStart = async (questionCount: number) => {
		setTotalQuestions(questionCount)
		const totalTime = questionCount * SECONDS_PER_QUESTION
		setTimeLeft(totalTime)
		await fetchQuestions()
	}

	const handleAnswerSelect = (questionId: string, answerId: string) => {
		setSelectedAnswers(prev => ({
			...prev,
			[questionId]: answerId,
		}))
	}

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(prev => prev - 1)
		}
	}

	const handleNextQuestion = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(prev => prev + 1)
		}
	}

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return '/avto6.webp'
		if (!mediaUrl.includes('\\')) {
			return `http://213.230.109.74:8080/${mediaUrl}`
		}
		const filename = mediaUrl.split('\\').pop()
		return `http://213.230.109.74:8080/${filename}`
	}

	const handleFinishTest = async () => {
		if (isSubmitting) return

		setIsSubmitting(true)
		try {
			const examTestCases = Object.entries(selectedAnswers).map(
				([testCaseId, selectedAnswerId]) => ({
					testCaseId,
					selectedAnswerId,
				})
			)

			const submitResponse = await submitAnswer({
				language,
				userId,
				examTestCases,
			})

			if (submitResponse.isSuccess) {
				setTestResults(submitResponse.result)
				setIsFinishDialogOpen(true)
			}
		} catch (error) {
			console.error('Error submitting test:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const allQuestionsAnswered = questions
		.slice(0, totalQuestions)
		.every(q => selectedAnswers[q.id])

	const currentQuestion = questions[currentQuestionIndex]

	const handleRedirectToResults = () => {
		return redirect(`${getLanguagePrefix()}/student/${userId}`)
	}

	if (!currentQuestion) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		)
	}

	return (
		<div className='container mx-auto p-4 space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex justify-between items-center'
			>
				<Timer
					timeLeft={timeLeft}
					totalTime={totalQuestions * SECONDS_PER_QUESTION}
				/>
				<Button
					onClick={() => setIsFinishDialogOpen(true)}
					disabled={!allQuestionsAnswered || timeLeft <= 0}
					className='bg-primary'
				>
					Testni yakunlash
				</Button>
			</motion.div>

			<div className='space-y-2'>
				<div className='grid grid-cols-10 gap-2 sm:grid-cols-20'>
					{Array.from({ length: totalQuestions }).map((_, index) => (
						<motion.button
							key={index}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`
          p-2 rounded-md flex items-center justify-center
          ${
						currentQuestionIndex === index
							? 'bg-primary text-primary-foreground'
							: 'bg-secondary'
					}
          ${
						selectedAnswers[questions[index]?.id]
							? 'border-2 border-primary'
							: ''
					}
          transition-all duration-200
        `}
							onClick={() => setCurrentQuestionIndex(index)}
						>
							{index + 1}
						</motion.button>
					))}
				</div>
			</div>

			<AnimatePresence mode='wait'>
				<motion.div
					key={currentQuestionIndex}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.2 }}
				>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle>
								Savol {currentQuestionIndex + 1} / {totalQuestions}
							</CardTitle>
						</CardHeader>
						<CardContent className='grid md:grid-cols-2 gap-6'>
							{currentQuestion.mediaUrl && (
								<div className='relative h-[300px] w-full'>
									<Image
										src={getImageUrl(currentQuestion.mediaUrl)}
										alt='Question illustration'
										fill
										className='object-contain rounded-lg'
										onError={e => {
											const target = e.target as HTMLImageElement
											target.src = '/avto6.webp'
										}}
									/>
								</div>
							)}
							<div className='space-y-4'>
								<p className='text-lg'>{currentQuestion.question}</p>
								<div className='space-y-3'>
									{currentQuestion.testAnswersForUser.map(answer => (
										<motion.div
											key={answer.id}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div
												className={`
                          p-4 rounded-lg border cursor-pointer transition-all
                          ${
														selectedAnswers[currentQuestion.id] === answer.id
															? 'border-primary bg-blue-500/25'
															: 'border-input hover:bg-accent'
													}
                          ${
														timeLeft <= 0
															? 'pointer-events-none opacity-50'
															: ''
													}
                        `}
												onClick={() =>
													handleAnswerSelect(currentQuestion.id, answer.id)
												}
											>
												{answer.answerText}
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</AnimatePresence>

			<div className='flex justify-between mt-6'>
				<Button
					onClick={handlePreviousQuestion}
					disabled={currentQuestionIndex === 0}
					variant='outline'
					className='w-[120px]'
				>
					<ChevronLeft className='mr-2 h-4 w-4' />
					Oldingi
				</Button>
				<Button
					onClick={handleNextQuestion}
					disabled={currentQuestionIndex === totalQuestions - 1}
					className='w-[120px]'
				>
					Keyingi
					<ChevronRight className='ml-2 h-4 w-4' />
				</Button>
			</div>

			<AlertDialog
				open={isFinishDialogOpen}
				onOpenChange={setIsFinishDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{testResults
								? 'Test natijalari'
								: 'Testni yakunlashni tasdiqlang'}
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						{testResults ? (
							<div className='flex flex-col gap-6 w-full'>
								{/* Natijalar statistikasi */}
								<div className='flex flex-col gap-3'>
									<div className='flex items-center justify-between'>
										<span className='font-medium text-gray-700'>
											To&apos;g&apos;ri javoblar:
										</span>
										<span className=' font-semibold text-green-600'>
											{testResults.corrertAnswers}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className=' font-medium text-gray-700'>
											Jami savollar:
										</span>
										<span className=' font-semibold text-blue-600'>
											{totalQuestions}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className=' font-medium text-gray-700'>Foiz:</span>
										<span className=' font-semibold text-purple-600'>
											{(
												(testResults.corrertAnswers / totalQuestions) *
												100
											).toFixed(1)}
											%
										</span>
									</div>
								</div>

								{/* Tugmalar */}
								<div className='flex flex-col sm:flex-row gap-3 w-full'>
									<AlertDialogAction
										onClick={() => window.location.reload()}
										className='w-full sm:w-1/2 bg-green-600 hover:bg-green-700'
									>
										Yangi test boshlash
									</AlertDialogAction>
									<AlertDialogAction
										onClick={handleRedirectToResults}
										className='w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700'
									>
										Natijalarni ko&apos;rish
									</AlertDialogAction>
								</div>
							</div>
						) : (
							<>
								<AlertDialogCancel className='bg-red-600 hover:bg-red-700 text-white'>
									Bekor qilish
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleFinishTest}
									disabled={isSubmitting}
									className='bg-primary hover:bg-primary/90'
								>
									{isSubmitting ? 'Yuklanmoqda...' : 'Yakunlash'}
								</AlertDialogAction>
							</>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

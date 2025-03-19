'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllTests } from '@/lib/test'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
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
	name: string | null
	explanation: string
	mediaUrl: string | null
	testAnswersForUser: null
	testAnswers: {
		id: string
		testCaseId: string
		answerText: string
		isCorrect: boolean
	}[]
}

interface TestPageProps {
	language: string
}

const SECONDS_PER_QUESTION = 1

export function TestPage({ language }: TestPageProps) {
	const [totalQuestions, setTotalQuestions] = useState(50)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [questions, setQuestions] = useState<TestQuestion[]>([])
	const [selectedAnswers, setSelectedAnswers] = useState<
		Record<string, string>
	>({})
	const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>(
		{}
	)
	const [timeLeft, setTimeLeft] = useState(0)
	const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoading, setIsLoading] = useState(false)
	const [results, setResults] = useState<{
		correct: number
		total: number
		percentage: number
	}>({ correct: 0, total: 0, percentage: 0 })
	//const t = useTranslations('Funksiyalar')
	const pathname = usePathname()

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
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
						setIsFinishDialogOpen(true)
						return 0
					}
					return prev - 1
				})
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [timeLeft])

	useEffect(() => {
		handleStart(50)
	}, [])

	const fetchQuestions = async () => {
		try {
			setIsLoading(true)
			const response = await getAllTests({
				pageSize: 50,
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

	const handleAnswerSelect = useCallback(
		(questionId: string, answerId: string) => {
			const currentQuestion = questions.find(q => q.id === questionId)
			if (currentQuestion) {
				const isCorrect =
					currentQuestion.testAnswers.find(a => a.id === answerId)?.isCorrect ||
					false
				setCorrectAnswers(prev => ({
					...prev,
					[questionId]: isCorrect,
				}))
			}
			setSelectedAnswers(prev => ({
				...prev,
				[questionId]: answerId,
			}))
		},
		[questions]
	)

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

	const allQuestionsAnswered = questions
		.slice(0, totalQuestions)
		.every(q => selectedAnswers[q.id])

	const currentQuestion = questions[currentQuestionIndex]

	useEffect(() => {
		if (questions.length > 0 && (allQuestionsAnswered || timeLeft === 0)) {
			const correct = Object.values(correctAnswers).filter(Boolean).length
			const total = totalQuestions
			const percentage = (correct / total) * 100
			setResults({ correct, total, percentage })
			setIsFinishDialogOpen(true)
		}
	}, [
		allQuestionsAnswered,
		timeLeft,
		correctAnswers,
		totalQuestions,
		questions,
	])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key >= 'F1' && event.key <= 'F7') {
				event.preventDefault()
				const index = parseInt(event.key.slice(1)) - 1
				const answer = currentQuestion?.testAnswers[index]
				if (answer && !selectedAnswers[currentQuestion.id]) {
					handleAnswerSelect(currentQuestion.id, answer.id)
				}
			} else if (event.key === 'ArrowLeft') {
				handlePreviousQuestion()
			} else if (event.key === 'ArrowRight') {
				handleNextQuestion()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [currentQuestion, handleAnswerSelect, selectedAnswers])

	if (!currentQuestion) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		)
	}

	return (
		<div className=' mx-auto p-2'>
			<AnimatePresence mode='wait'>
				<motion.div
					key={currentQuestionIndex}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.2 }}
				>
					<Card className='w-full'>
						<CardHeader className='p-0'>
							<CardTitle className='text-xl font-roboto tracking-normal bg-sky-100 p-5 mb-4 dark:bg-blue-500/80'>
								{currentQuestion.question}
							</CardTitle>
						</CardHeader>
						<CardContent className='grid md:grid-cols-2 gap-6'>
							{currentQuestion.mediaUrl && (
								<div className='relative h-[400px] w-full'>
									{' '}
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
								<div className='space-y-3'>
									{currentQuestion.testAnswers.map((answer, index) => (
										<motion.div
											key={answer.id}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className='flex items-center justify-center gap-2'
										>
											<div className='py-3 px-5 flex items-center justify-start border bg-blue-500/80'>
												F{index + 1}
											</div>
											<div
												className={`p-2 flex items-center justify-start flex-grow  border cursor-pointer transition-all
                                                    ${
																											selectedAnswers[
																												currentQuestion.id
																											] === answer.id
																												? correctAnswers[
																														currentQuestion.id
																												  ]
																													? 'bg-green-500'
																													: 'bg-red-500'
																												: 'border-input hover:bg-accent'
																										}
                                                    ${
																											timeLeft <= 0 ||
																											selectedAnswers[
																												currentQuestion.id
																											]
																												? 'pointer-events-none opacity-100'
																												: ''
																										}
                                                `}
												onClick={() =>
													!selectedAnswers[currentQuestion.id] &&
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

						<div className='flex justify-between m-6'>
							<Button
								onClick={handlePreviousQuestion}
								disabled={currentQuestionIndex === 0}
								variant='outline'
								className='w-[120px]'
							>
								<ChevronLeft className='mr-2 h-4 w-4' />
								Oldingi
							</Button>
							<span className='text-xl font-bold'>
								Savol {currentQuestionIndex + 1} / {totalQuestions}
							</span>
							<Button
								onClick={handleNextQuestion}
								disabled={currentQuestionIndex === totalQuestions - 1}
								className='w-[120px]'
							>
								Keyingi
								<ChevronRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					</Card>
				</motion.div>
			</AnimatePresence>

			<div className='flex items-center my-2 justify-between gap-2'>
				<div className='w-full space-y-2'>
					<div className='grid grid-cols-10 gap-1 sm:grid-cols-25'>
						{Array.from({ length: totalQuestions }).map((_, index) => {
							const questionId = questions[index]?.id
							const isAnswered = selectedAnswers[questionId]
							const isCorrect = correctAnswers[questionId]

							return (
								<motion.button
									key={index}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`
				p-2 flex items-center justify-center
				${
					currentQuestionIndex === index
						? 'bg-primary text-primary-foreground'
						: isAnswered
						? isCorrect
							? 'bg-green-500'
							: 'bg-red-500'
						: 'bg-secondary'
				}
				${selectedAnswers[questionId]}
				transition-all duration-200
			`}
									onClick={() => setCurrentQuestionIndex(index)}
								>
									{index + 1}
								</motion.button>
							)
						})}
					</div>
				</div>
				<Timer
					timeLeft={timeLeft}
					totalTime={totalQuestions * SECONDS_PER_QUESTION}
				/>
			</div>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex justify-between items-center'
			></motion.div>

			<AlertDialog
				open={isFinishDialogOpen}
				onOpenChange={setIsFinishDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Test natijalari</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<div className='flex flex-col gap-6 w-full'>
							<div className='flex flex-col gap-3'>
								<div className='flex items-center justify-between'>
									<span className='font-medium text-gray-700'>
										To&apos;g&apos;ri javoblar:
									</span>
									<span className='font-semibold text-green-600'>
										{results.correct}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium text-gray-700'>
										Jami savollar:
									</span>
									<span className='font-semibold text-blue-600'>
										{results.total}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium text-gray-700'>Foiz:</span>
									<span className='font-semibold text-purple-600'>
										{results.percentage.toFixed(2)} %
									</span>
								</div>
							</div>

							<div className='flex flex-col sm:flex-row gap-3 w-full'>
								<AlertDialogAction
									onClick={() => redirect(`${getLanguagePrefix()}`)}
									className='w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700'
								>
									Chiqish
								</AlertDialogAction>
								<AlertDialogAction
									onClick={() => window.location.reload()}
									className='w-full sm:w-1/2 bg-green-600 hover:bg-green-700'
								>
									Yangi test boshlash
								</AlertDialogAction>
							</div>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

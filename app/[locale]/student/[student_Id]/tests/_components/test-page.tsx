'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StartDialog } from './start-dialog'
import { getAllTests, submitAnswer } from '@/lib/test'
import Image from 'next/image'
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

const SECONDS_PER_QUESTION = 20
const QUESTIONS_PER_PAGE = 50

export function TestPage({ language, userId }: TestPageProps) {
	const [isStartDialogOpen, setIsStartDialogOpen] = useState(true)
	const [totalQuestions, setTotalQuestions] = useState(0)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [questions, setQuestions] = useState<TestQuestion[]>([])
	const [selectedAnswers, setSelectedAnswers] = useState<
		Record<string, string>
	>({})
	const [timeLeft, setTimeLeft] = useState(0)
	//const [isLoading, setIsLoading] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [testResults, setTestResults] = useState<any>(null)
	const [currentPage, setCurrentPage] = useState(0)

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

	const fetchQuestions = async (pageNumber: number) => {
		try {
			const response = await getAllTests({
				pageSize: QUESTIONS_PER_PAGE,
				pageNumber,
				language,
			})

			if (response?.items) {
				// Faqat yangi sahifadagi savollarni o'rnatamiz, eski savollarni saqlamaymiz
				setQuestions(response.items)
			}
		} catch (error) {
			console.error('Error fetching questions:', error)
		}
	}

	const handleStart = async (questionCount: number) => {
		setTotalQuestions(questionCount)
		setTimeLeft(questionCount * SECONDS_PER_QUESTION)
		setIsStartDialogOpen(false)
		await fetchQuestions(0) // Dastlabki 20 ta savolni yuklash
	}

	const handleAnswerSelect = (questionId: string, answerId: string) => {
		setSelectedAnswers(prev => ({
			...prev,
			[questionId]: answerId,
		}))
	}

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1)
		}
	}

	const handleNextQuestion = () => {
		if (currentQuestionIndex < QUESTIONS_PER_PAGE - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		}
	}

	// const handlePreviousPage = async () => {
	// 	if (currentPage > 0) {
	// 		const newPage = currentPage - 1
	// 		setCurrentPage(newPage)
	// 		setCurrentQuestionIndex(0) // Sahifa o'zgarganda birinchi savolga qaytamiz
	// 		await fetchQuestions(newPage) // Oldingi sahifadagi savollarni yuklaymiz
	// 	}
	// }

	// const handleNextPage = async () => {
	// 	const newPage = currentPage + 1
	// 	if (newPage * QUESTIONS_PER_PAGE < totalQuestions) {
	// 		setCurrentPage(newPage)
	// 		setCurrentQuestionIndex(0) // Sahifa o'zgarganda birinchi savolga qaytamiz
	// 		await fetchQuestions(newPage) // Keyingi sahifadagi savollarni yuklaymiz
	// 	}
	// }

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return '/testbox.svg'

		if (!mediaUrl.includes('\\')) {
			return `http://213.230.109.74:8080/${mediaUrl}`
		}

		const filename = mediaUrl.split('\\').pop()
		return `http://213.230.109.74:8080/${filename}`
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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

			const result = await submitAnswer({
				language,
				userId,
				examTestCases,
			})

			if (result.isSuccess) {
				setTestResults(result.result)
				setIsFinishDialogOpen(true)
			} else {
				console.error('Error submitting test:', result.errorMessages)
			}
		} catch (error) {
			console.error('Error submitting test:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const allQuestionsAnswered =
		questions.length > 0 && questions.every(q => selectedAnswers[q.id])

	if (isStartDialogOpen) {
		return (
			<StartDialog
				isOpen={isStartDialogOpen}
				onStart={handleStart}
				//minQuestions={20}
				maxQuestions={50}
			/>
		)
	}

	const currentQuestion = questions[currentQuestionIndex]

	if (!currentQuestion) {
		return <div>Savollar yuklanmoqda...</div>
	}

	// const startQuestionNumber = currentPage * QUESTIONS_PER_PAGE + 1
	// const endQuestionNumber = Math.min(
	// 	(currentPage + 1) * QUESTIONS_PER_PAGE,
	// 	totalQuestions
	// )

	return (
		<div className='w-full p-4'>
			<div className='flex justify-between items-center mb-6'>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2 text-lg font-medium'>
						<Timer className='h-5 w-5' />
						{formatTime(timeLeft)}
					</div>
				</div>
				<Button
					onClick={() => setIsFinishDialogOpen(true)}
					disabled={!allQuestionsAnswered}
				>
					Testni yakunlash
				</Button>
			</div>

			{/* <div className='flex items-center justify-between mb-4'>
				<Button
					variant='outline'
					onClick={handlePreviousPage}
					disabled={currentPage === 0 || isLoading}
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Avvalgi {QUESTIONS_PER_PAGE} ta
				</Button>
				<span className='text-sm text-muted-foreground'>
					{startQuestionNumber}-{endQuestionNumber} / {totalQuestions} ta savol
				</span>
				<Button
					variant='outline'
					onClick={handleNextPage}
					disabled={
						(currentPage + 1) * QUESTIONS_PER_PAGE >= totalQuestions ||
						isLoading
					}
				>
					Keyingi {QUESTIONS_PER_PAGE} ta
					<ArrowRight className='ml-2 h-4 w-4' />
				</Button>
			</div> */}

			<div className='flex flex-wrap gap-2 justify-center mb-6'>
				{Array.from({ length: totalQuestions }).map((_, index) => {
					const page = Math.floor(index / QUESTIONS_PER_PAGE)
					const isCurrentPage = page === currentPage
					const isCurrentQuestion =
						index === currentPage * QUESTIONS_PER_PAGE + currentQuestionIndex

					return (
						<Button
							key={index}
							variant={isCurrentQuestion ? 'default' : 'outline'}
							className={`w-10 h-10 ${
								selectedAnswers[questions[index % QUESTIONS_PER_PAGE]?.id]
									? 'bg-primary/20'
									: ''
							}`}
							onClick={() => {
								if (page !== currentPage) {
									setCurrentPage(page)
									fetchQuestions(page)
								}
								setCurrentQuestionIndex(index % QUESTIONS_PER_PAGE)
							}}
							disabled={!isCurrentPage}
						>
							{index + 1}
						</Button>
					)
				})}
			</div>

			<Card className='w-full'>
				<CardHeader>
					<CardTitle>
						Savol {currentPage * QUESTIONS_PER_PAGE + currentQuestionIndex + 1}{' '}
						/ {totalQuestions}
					</CardTitle>
				</CardHeader>
				<CardContent className='flex gap-6'>
					{currentQuestion.mediaUrl && (
						<div className='relative h-[300px] w-[50%]'>
							<Image
								src={getImageUrl(currentQuestion.mediaUrl)}
								alt='Question illustration'
								fill
								className='object-contain'
								onError={e => {
									const target = e.target as HTMLImageElement
									target.src = '/testbox.svg'
								}}
							/>
						</div>
					)}
					<div className='w-[50%] space-y-4'>
						<div className='text-lg'>{currentQuestion.question}</div>
						{currentQuestion.testAnswersForUser.map(answer => (
							<div
								key={answer.id}
								className={`p-4 rounded-lg border cursor-pointer transition-colors
                  ${
										selectedAnswers[currentQuestion.id] === answer.id
											? 'border-primary bg-primary/5'
											: 'border-input hover:bg-accent'
									}`}
								onClick={() =>
									handleAnswerSelect(currentQuestion.id, answer.id)
								}
							>
								{answer.answerText}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className='flex justify-between mt-6'>
				<Button
					onClick={handlePreviousQuestion}
					disabled={currentQuestionIndex === 0}
					variant='outline'
				>
					<ChevronLeft className='mr-2 h-4 w-4' />
					Oldingi savol
				</Button>
				<Button
					onClick={handleNextQuestion}
					disabled={currentQuestionIndex === QUESTIONS_PER_PAGE - 1}
				>
					Keyingi savol
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
						<AlertDialogDescription>
							{testResults ? (
								<div className='space-y-2'>
									<div>Togri javoblar: {testResults.corrertAnswers}</div>
									<div>Jami savollar: {testResults.totalQuestions}</div>
									<div>
										Foiz:{' '}
										{(
											(testResults.corrertAnswers / totalQuestions) *
											100
										).toFixed(1)}
										%
									</div>
								</div>
							) : (
								'Testni yakunlashni xohlaysizmi? Bu amalni qaytarib bolmaydi.'
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						{testResults ? (
							<AlertDialogAction onClick={() => window.location.reload()}>
								Yangi test boshlash
							</AlertDialogAction>
						) : (
							<>
								<AlertDialogCancel>Bekor qilish</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleFinishTest}
									disabled={isSubmitting}
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

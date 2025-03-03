'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	XCircle,
	ArrowLeft,
	ArrowRight,
} from 'lucide-react'
import { StartDialog } from './start-dialog'
import { Timer } from './timer'
import { ResultDialog } from './result-dialog'

const SECONDS_PER_QUESTION = 25
const QUESTIONS_PER_PAGE = 10

interface ITestAnswer {
	id: string
	testCaseId: string
	answerText: string
	isCorrect: boolean
}

interface ITestItem {
	id: string
	name: string | null
	question: string
	explanation: string
	mediaUrl: string
	testAnswersForUser: ITestAnswer[]
}

interface ITestResponse {
	items: ITestItem[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
}

interface Props {
	response: ITestResponse
	language?: string
}

const getImageUrl = (mediaUrl: string | null) => {
	if (!mediaUrl || mediaUrl === '1') return '/testbox.svg'

	if (!mediaUrl.includes('\\')) {
		return `http://213.230.109.74:8080/${mediaUrl}`
	}

	const filename = mediaUrl.split('\\').pop()
	return `http://213.230.109.74:8080/${filename}`
}

export default function Test({ response }: Props) {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [isStartDialogOpen, setIsStartDialogOpen] = useState(true)
	const [isTestCompleted, setIsTestCompleted] = useState(false)
	const [isTestStarted, setIsTestStarted] = useState(false)
	const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
	const [selectedQuestions, setSelectedQuestions] = useState<ITestItem[]>([])
	const [answers, setAnswers] = useState<(number | null)[]>([])
	const [timeLeft, setTimeLeft] = useState(0)
	const [testResults, setTestResults] = useState({
		correctAnswers: 0,
		totalQuestions: 0,
		percentage: 0,
	})

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

	useEffect(() => {
		const newPage = Math.floor(currentQuestion / QUESTIONS_PER_PAGE)
		if (newPage !== currentPage) {
			setCurrentPage(newPage)
		}
	}, [currentQuestion])

	const handleStartTest = (questionCount: number) => {
		const shuffled = [...response.items].sort(() => 0.5 - Math.random())
		const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length))
		setSelectedQuestions(selected)
		setAnswers(new Array(selected.length).fill(null))
		setTimeLeft(questionCount * SECONDS_PER_QUESTION)
		setIsStartDialogOpen(false)
		setIsTestStarted(true)
		setIsTestCompleted(false)
		setCurrentPage(0)
		setCurrentQuestion(0)
	}

	const handleTestComplete = async () => {
		if (isTestCompleted) return

		const correctCount = answers.filter((answer, index) => {
			if (answer === null) return false
			return selectedQuestions[index].testAnswersForUser[answer].isCorrect
		}).length

		const results = {
			correctAnswers: correctCount,
			totalQuestions: answers.length,
			percentage: (correctCount / answers.length) * 100,
		}

		setTestResults(results)
		setIsTestCompleted(true)
		setIsResultDialogOpen(true)
		setTimeLeft(0)
	}

	const handleAnswerSelect = (index: number) => {
		if (isTestCompleted || answers[currentQuestion] !== null || timeLeft <= 0)
			return

		const newAnswers = [...answers]
		newAnswers[currentQuestion] = index
		setAnswers(newAnswers)
	}

	if (!isTestStarted && isStartDialogOpen) {
		return <StartDialog isOpen={isStartDialogOpen} onStart={handleStartTest} />
	}

	const currentQuestionData = selectedQuestions[currentQuestion]
	if (!currentQuestionData) return <div>Savol topilmadi</div>

	const resetTest = () => {
		setCurrentQuestion(0)
		setCurrentPage(0)
		setIsTestStarted(false)
		setIsTestCompleted(false)
		setIsResultDialogOpen(false)
		setAnswers([])
		setTestResults({ correctAnswers: 0, totalQuestions: 0, percentage: 0 })
		setIsStartDialogOpen(true)
	}

	const totalPages = Math.ceil(selectedQuestions.length / QUESTIONS_PER_PAGE)
	const startIndex = currentPage * QUESTIONS_PER_PAGE
	const endIndex = Math.min(
		startIndex + QUESTIONS_PER_PAGE,
		selectedQuestions.length
	)
	const currentPageQuestions = selectedQuestions.slice(startIndex, endIndex)

	const handlePageChange = (newPage: number) => {
		if (newPage >= 0 && newPage < totalPages) {
			setCurrentPage(newPage)
			setCurrentQuestion(newPage * QUESTIONS_PER_PAGE)
		}
	}

	const handleNextQuestion = () => {
		const nextQuestion = currentQuestion + 1
		if (nextQuestion < selectedQuestions.length) {
			setCurrentQuestion(nextQuestion)
		}
	}

	const handlePrevQuestion = () => {
		const prevQuestion = currentQuestion - 1
		if (prevQuestion >= 0) {
			setCurrentQuestion(prevQuestion)
		}
	}

	return (
		<div className='min-h-screen bg-background p-2 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				{/* Car Animation and Timer */}
				<div
					className='h-12 overflow-hidden flex items-center justify-start'
					style={{
						backgroundImage: `url(${'/road.svg'})`,
						backgroundSize: 'cover',
					}}
				>
					<motion.div
						initial={{ x: '0%' }}
						animate={{ x: '100%' }}
						transition={{ duration: timeLeft, ease: 'linear' }}
						className='w-full'
					>
						<Image src='/car.png' alt='Car' width={80} height={40} />
					</motion.div>
				</div>

				{/* Question Navigation */}
				<div className='flex items-center justify-between'>
					<Timer
						timeLeft={timeLeft}
						duration={selectedQuestions.length * SECONDS_PER_QUESTION}
						questionCount={selectedQuestions.length}
					/>

					<div className='flex-1 px-8'>
						<div className='flex items-center justify-center gap-4'>
							<Button
								variant='outline'
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 0}
								className='hidden md:flex'
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Avvalgi {QUESTIONS_PER_PAGE}
							</Button>

							<div className='flex items-center gap-2 flex-wrap max-w-3xl justify-center'>
								{currentPageQuestions.map((_, idx) => {
									const questionIndex = startIndex + idx
									const answer = answers[questionIndex]
									const isCorrect =
										answer !== null &&
										selectedQuestions[questionIndex].testAnswersForUser[answer]
											.isCorrect

									return (
										<Button
											key={idx}
											variant={
												currentQuestion === questionIndex
													? 'default'
													: 'outline'
											}
											className={`w-10 h-10 ${
												isTestCompleted && answer !== null
													? isCorrect
														? 'bg-green-500/10 hover:bg-green-500/20 text-green-500'
														: 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
													: ''
											}`}
											onClick={() => setCurrentQuestion(questionIndex)}
										>
											{questionIndex + 1}
										</Button>
									)
								})}
							</div>

							<Button
								variant='outline'
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage >= totalPages - 1}
								className='hidden md:flex'
							>
								Keyingi {QUESTIONS_PER_PAGE}
								<ArrowRight className='h-4 w-4 ml-2' />
							</Button>
						</div>
					</div>

					{isTestCompleted ? (
						<Button onClick={resetTest}>Testni boshlash</Button>
					) : (
						<Button variant='destructive' onClick={handleTestComplete}>
							Testni yakunlash
						</Button>
					)}
				</div>

				{/* Question Card */}
				<Card className='border-2'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-2xl'>
								Savol {currentQuestion + 1} / {selectedQuestions.length}
							</CardTitle>
							{isTestCompleted && (
								<Dialog>
									<DialogTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											className='flex flex-col'
										>
											<Image
												src='/bulb.png'
												alt='bulb'
												width={40}
												height={40}
											/>
											Izoh
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle className='text-2xl'>Izoh:</DialogTitle>
											<DialogDescription className='flex items-center justify-center gap-4'>
												<Image
													src='/teacher.jpg'
													alt='teacher'
													width={200}
													height={200}
												/>
												<span className='font-bold'>
													{currentQuestionData.explanation}
												</span>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
							)}
						</div>
						<CardDescription className='text-lg'>
							{currentQuestionData.question}
						</CardDescription>
					</CardHeader>
					<CardContent className='grid md:grid-cols-2 gap-8'>
						<div className='relative rounded-lg overflow-hidden h-[300px]'>
							<Image
								src={getImageUrl(currentQuestionData.mediaUrl)}
								alt='question'
								className='w-full h-full object-contain bg-gray-100'
								width={300}
								height={300}
							/>
						</div>

						<div className='space-y-4'>
							{currentQuestionData?.testAnswersForUser?.map((answer, index) => {
								const isSelected = answers[currentQuestion] === index
								const isCorrect = answer.isCorrect

								return (
									<motion.div
										key={index}
										whileHover={{
											scale: isTestCompleted || timeLeft <= 0 ? 1 : 1.02,
										}}
										whileTap={{
											scale: isTestCompleted || timeLeft <= 0 ? 1 : 0.98,
										}}
									>
										<div
											className={`relative rounded-lg border ${
												isSelected ? 'border-primary' : 'border-input'
											} ${
												isTestCompleted && isSelected
													? isCorrect
														? 'border-green-500 bg-green-500/10'
														: 'border-red-500 bg-red-500/10'
													: ''
											} transition-colors hover:bg-accent hover:text-accent-foreground`}
										>
											<button
												className='w-full p-4 text-left flex items-start gap-3 disabled:cursor-not-allowed disabled:opacity-50'
												onClick={() => handleAnswerSelect(index)}
												disabled={
													isTestCompleted ||
													answers[currentQuestion] !== null ||
													timeLeft <= 0
												}
											>
												{isTestCompleted && isSelected && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className='mt-1'
													>
														{isCorrect ? (
															<CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
														) : (
															<XCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
														)}
													</motion.div>
												)}
												<span className='text-base leading-relaxed break-words'>
													{answer.answerText}
												</span>
											</button>
										</div>
									</motion.div>
								)
							})}
						</div>
					</CardContent>
				</Card>

				{/* Navigation Buttons */}
				<div className='flex justify-between'>
					<Button
						variant='outline'
						onClick={handlePrevQuestion}
						disabled={currentQuestion === 0}
					>
						<ChevronLeft className='mr-2 h-4 w-4' />
						Oldingi savol
					</Button>
					<Button
						onClick={handleNextQuestion}
						disabled={currentQuestion === selectedQuestions.length - 1}
					>
						Keyingi savol
						<ChevronRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
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

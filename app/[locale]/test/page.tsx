'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	XCircle,
	Image as ImageIcon,
	Lightbulb,
} from 'lucide-react'
import { getAllTestsAdmin } from '@/lib/test'
import type { Test } from '@/lib/test'

export default function AllUserPage() {
	const [tests, setTests] = useState<Test[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [imageError, setImageError] = useState(false)
	const [showExplanation, setShowExplanation] = useState(false)
	const [showCongratulation, setShowCongratulation] = useState(false)
	const [correctAnswers, setCorrectAnswers] = useState(0)
	const [totalAnswered, setTotalAnswered] = useState(0)
	const [pageNumber, setPageNumber] = useState(0)

	const correctSoundRef = useRef<HTMLAudioElement | null>(null)
	const incorrectSoundRef = useRef<HTMLAudioElement | null>(null)

	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	useEffect(() => {
		correctSoundRef.current = new Audio('/correct.mp3')
		incorrectSoundRef.current = new Audio('/incorrect.mp3')

		fetchTests()
	}, [language, pageNumber])

	const fetchTests = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getAllTestsAdmin(pageNumber, 20, language)

			if (response.isSuccess) {
				if (pageNumber === 0) {
					setTests(response.result.items)
				} else {
					setTests(prev => [...prev, ...response.result.items])
				}
			} else {
				setError(response.errorMessages?.join(', ') || 'Failed to fetch tests')
			}
		} catch (error) {
			setError('Failed to fetch tests')
			console.error('Error fetching tests:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleAnswerSelect = (answerId: string) => {
		if (selectedAnswer) return // Prevent changing answer after selection

		setSelectedAnswer(answerId)

		const currentQuestion = tests[currentQuestionIndex]
		const selectedAnswerObj = currentQuestion.testAnswers.find(
			a => a.id === answerId
		)

		if (selectedAnswerObj) {
			const correct = selectedAnswerObj.isCorrect
			setIsCorrect(correct)

			// Play sound
			if (correct) {
				correctSoundRef.current?.play()
				setCorrectAnswers(prev => prev + 1)
				setShowCongratulation(true)
				setTimeout(() => setShowCongratulation(false), 2000)
			} else {
				incorrectSoundRef.current?.play()
			}

			setTotalAnswered(prev => prev + 1)
		}
	}

	const nextQuestion = () => {
		if (currentQuestionIndex < tests.length - 1) {
			setCurrentQuestionIndex(prev => prev + 1)
			resetQuestion()
		} else if (selectedAnswer) {
			// Load more questions when reaching the end
			setPageNumber(prev => prev + 1)
		}
	}

	const prevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(prev => prev - 1)
			resetQuestion()
		}
	}

	const resetQuestion = () => {
		setSelectedAnswer(null)
		setIsCorrect(null)
		setImageError(false)
		setShowExplanation(false)
	}

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return null
		if (mediaUrl.startsWith('Files/')) {
			return `http://213.230.109.74:8080/${mediaUrl}`
		}
		return null
	}

	// const playSound = () => {
	// 	if (isCorrect === true) {
	// 		correctSoundRef.current?.play()
	// 	} else if (isCorrect === false) {
	// 		incorrectSoundRef.current?.play()
	// 	}
	// }

	if (loading && tests.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-center text-destructive'>
					<p className='text-xl'>{error}</p>
					<Button onClick={fetchTests} className='mt-4'>
						Qayta urinish
					</Button>
				</div>
			</div>
		)
	}

	if (tests.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-center'>
					<p className='text-xl'>Savollar topilmadi</p>
					<Button onClick={fetchTests} className='mt-4'>
						Qayta urinish
					</Button>
				</div>
			</div>
		)
	}

	const currentQuestion = tests[currentQuestionIndex]

	return (
		<div className='min-h-screen bg-background p-4 md:p-8 transition-colors duration-300'>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Header with controls */}
				<div className='flex flex-wrap justify-between items-center gap-4'>
					<div className='flex items-center gap-2'>
						<h1 className='text-2xl font-bold'>Amaliyot</h1>
						<span className='text-muted-foreground'>
							({currentQuestionIndex + 1}/{tests.length})
						</span>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2 text-sm'>
							<span className='text-green-600 font-medium'>
								{correctAnswers}
							</span>
							<span>/</span>
							<span>{totalAnswered}</span>
							<span className='text-muted-foreground'>to&apos;g&apos;ri</span>
						</div>
					</div>
				</div>

				{/* Question Card */}
				<Card className='border-2 shadow-lg'>
					<CardHeader className='border-b bg-muted/50'>
						<CardDescription>
							Savol {currentQuestionIndex + 1} / {tests.length}
						</CardDescription>
						<CardTitle className='text-xl'>
							{currentQuestion.question}
						</CardTitle>
					</CardHeader>
					<CardContent className='p-6'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* variantlar bo'limi*/}
							<div className='order-2 lg:order-2 space-y-4'>
								<div className='grid gap-3'>
									{currentQuestion.testAnswers.map(answer => (
										<motion.div
											key={answer.id}
											whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
											whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
										>
											<Button
												variant='outline'
												className={`w-full text-wrap justify-start text-left p-4 h-auto transition-all duration-300 border-2 ${
													selectedAnswer === answer.id && answer.isCorrect
														? 'bg-green-600/20 border-green-600 text-green-700 dark:text-green-300 shadow-[0_0_10px_rgba(22,163,74,0.2)]'
														: selectedAnswer === answer.id && !answer.isCorrect
														? 'bg-red-600/20 border-red-600 text-red-700 dark:text-red-300 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
														: selectedAnswer && answer.isCorrect
														? 'bg-green-600/20 border-green-600 text-green-700 dark:text-green-300 shadow-[0_0_10px_rgba(22,163,74,0.2)]'
														: 'hover:border-primary/50'
												}`}
												onClick={() => handleAnswerSelect(answer.id)}
												disabled={!!selectedAnswer}
											>
												<div className='flex items-start gap-3'>
													{selectedAnswer && (
														<div className='mt-0.5'>
															{answer.isCorrect ? (
																<CheckCircle2 className='h-5 w-5 text-green-600' />
															) : selectedAnswer === answer.id ? (
																<XCircle className='h-5 w-5 text-red-600' />
															) : null}
														</div>
													)}
													<span className='text-base'>{answer.answerText}</span>
												</div>
											</Button>
										</motion.div>
									))}
								</div>

								{/* Controls */}
								{selectedAnswer && (
									<div className='flex items-center justify-end gap-2 pt-4'>
										<Button
											variant='outline'
											onClick={() => setShowExplanation(!showExplanation)}
											className='bg-yellow-500 hover:bg-primary/10 w-fit'
										>
											<Lightbulb className='h-4 w-4' /> <span>Izoh</span>
										</Button>
										{/* <Button
											variant='outline'
											size='icon'
											onClick={playSound}
											className='hover:bg-primary/10'
										>
											<Volume2 className='h-4 w-4' />
										</Button> */}
									</div>
								)}

								{/* Explanation */}
								<AnimatePresence>
									{showExplanation && selectedAnswer && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											className={`p-4 rounded-lg border-2 ${
												isCorrect
													? 'bg-green-600/10 border-green-600/30'
													: 'bg-red-600/10 border-red-600/30'
											}`}
										>
											<p className='text-sm leading-relaxed'>
												{currentQuestion.explanation}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Question Image */}
							<div className='order-1 lg:order-1'>
								<div className='sticky top-6'>
									{currentQuestion.mediaUrl ? (
										<div className='rounded-lg overflow-hidden border-1 shadow-2xl'>
											{getImageUrl(currentQuestion.mediaUrl) && !imageError ? (
												<Image
													src={getImageUrl(currentQuestion.mediaUrl)!}
													alt={currentQuestion.question}
													width={600}
													height={400}
													className='w-full h-auto object-contain max-h-[400px]'
													onError={() => setImageError(true)}
												/>
											) : (
												<div className='w-full h-[300px] bg-muted rounded flex items-center justify-center'>
													<ImageIcon className='h-16 w-16 text-muted-foreground' />
												</div>
											)}
										</div>
									) : (
										<Image
											src={'/testbox.svg'}
											alt={currentQuestion.question}
											width={600}
											height={400}
											className='w-full h-auto object-contain max-h-[400px]'
											onError={() => setImageError(true)}
										/>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Navigation Buttons */}
				<div className='flex justify-between'>
					<Button
						variant='outline'
						onClick={prevQuestion}
						disabled={currentQuestionIndex === 0}
						className='transition-colors duration-300 border-2 hover:bg-primary/10'
					>
						<ChevronLeft className='mr-2 h-4 w-4' />
						Oldingi savol
					</Button>

					<Button
						onClick={nextQuestion}
						disabled={
							currentQuestionIndex === tests.length - 1 && !selectedAnswer
						}
						className='transition-colors duration-300 bg-primary hover:bg-primary/90'
					>
						{currentQuestionIndex === tests.length - 1
							? 'Davom etish'
							: 'Keyingi savol'}
						<ChevronRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Congratulation Animation */}
			<AnimatePresence>
				{showCongratulation && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className='fixed inset-0 flex items-center justify-center pointer-events-none z-50'
					>
						<div className='bg-green-600/20 backdrop-blur-sm p-8 rounded-lg shadow-lg'>
							<motion.div
								initial={{ y: -20 }}
								animate={{ y: [0, -10, 0, -5, 0] }}
								transition={{ duration: 1 }}
							>
								<CheckCircle2 className='h-24 w-24 text-green-600 mx-auto' />
								<h2 className='text-2xl font-bold text-center mt-4 text-green-700 dark:text-green-300'>
									Ajoyib!
								</h2>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// <Button
// variant='custom'
// className='w-fit'
// onClick={resetPractice}
// title='Qayta boshlash'
// >
// <RefreshCw className='h-4 w-4' /> Qayta boshlash
// </Button>

// const resetPractice = () => {
// 	setCurrentQuestionIndex(0)
// 	resetQuestion()
// 	setCorrectAnswers(0)
// 	setTotalAnswered(0)
// 	setPageNumber(0)
// 	setTests([])
// 	fetchTests()
// }

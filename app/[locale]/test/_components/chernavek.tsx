// 'use client'

// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import Image from 'next/image'
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
// 	ChevronLeft,
// 	ChevronRight,
// 	CheckCircle2,
// 	XCircle,
// 	Image as ImageIcon,
// 	Lightbulb,
// 	ArrowLeft,
// } from 'lucide-react'
// import { getAllTestsAdmin } from '@/lib/test'
// import type { Test } from '@/lib/test'
// import { useTranslations } from 'next-intl'
// import Link from 'next/link'

// export default function AllUserTestPage() {
// 	const t = useTranslations('Testwithanswer')
// 	const [tests, setTests] = useState<Test[]>([])
// 	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
// 	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
// 	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
// 	const [loading, setLoading] = useState(true)
// 	const [error, setError] = useState<string | null>(null)
// 	const [imageError, setImageError] = useState(false)
// 	const [showExplanation, setShowExplanation] = useState(false)
// 	const [correctAnswers, setCorrectAnswers] = useState(0)
// 	const [totalAnswered, setTotalAnswered] = useState(0)
// 	const [pageNumber, setPageNumber] = useState(0)

// 	// const correctSoundRef = useRef<HTMLAudioElement | null>(null)
// 	// const incorrectSoundRef = useRef<HTMLAudioElement | null>(null)

// 	const pathname = usePathname()
// 	const pathSegments = pathname.split('/')
// 	const language =
// 		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
// 			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
// 			: 'uz'

// 	const getLanguagePrefix = () => {
// 		const segments = pathname.split('/')
// 		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
// 			return `/${segments[1]}`
// 		}
// 		return ''
// 	}

// 	useEffect(() => {
// 		// correctSoundRef.current = new Audio('/correct.mp3')
// 		// incorrectSoundRef.current = new Audio('/incorrect.mp3')

// 		fetchTests()
// 	}, [language, pageNumber])

// 	const fetchTests = async () => {
// 		try {
// 			setLoading(true)
// 			setError(null)
// 			const response = await getAllTestsAdmin(pageNumber, 20, language)

// 			if (response.isSuccess) {
// 				if (pageNumber === 0) {
// 					setTests(response.result.items)
// 				} else {
// 					setTests(prev => [...prev, ...response.result.items])
// 				}
// 			} else {
// 				setError(response.errorMessages?.join(', ') || 'Failed to fetch tests')
// 			}
// 		} catch (error) {
// 			setError('Failed to fetch tests')
// 			console.error('Error fetching tests:', error)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const handleAnswerSelect = (answerId: string) => {
// 		if (selectedAnswer) return // Prevent changing answer after selection

// 		setSelectedAnswer(answerId)

// 		const currentQuestion = tests[currentQuestionIndex]
// 		const selectedAnswerObj = currentQuestion.testAnswers.find(
// 			a => a.id === answerId
// 		)

// 		if (selectedAnswerObj) {
// 			const correct = selectedAnswerObj.isCorrect
// 			setIsCorrect(correct)

// 			// Play sound
// 			if (correct) {
// 				setCorrectAnswers(prev => prev + 1)
// 			}
// 			setTotalAnswered(prev => prev + 1)
// 		}
// 	}

// 	const nextQuestion = () => {
// 		if (currentQuestionIndex < tests.length - 1) {
// 			setCurrentQuestionIndex(prev => prev + 1)
// 			resetQuestion()
// 		} else if (selectedAnswer) {
// 			// Load more questions when reaching the end
// 			setPageNumber(prev => prev + 1)
// 		}
// 	}

// 	const prevQuestion = () => {
// 		if (currentQuestionIndex > 0) {
// 			setCurrentQuestionIndex(prev => prev - 1)
// 			resetQuestion()
// 		}
// 	}

// 	const resetQuestion = () => {
// 		setSelectedAnswer(null)
// 		setIsCorrect(null)
// 		setImageError(false)
// 		setShowExplanation(false)
// 	}

// 	const getImageUrl = (mediaUrl: string | null) => {
// 		if (!mediaUrl || mediaUrl === '1') return '/avto6.webp'
// 		if (mediaUrl.startsWith('Files/')) {
// 			return `http://213.230.109.74:8080/${mediaUrl}`
// 		}
// 		return null
// 	}

// 	useEffect(() => {
// 		const handleKeyDownArrow = (event: KeyboardEvent) => {
// 			if (event.key === 'ArrowLeft') {
// 				prevQuestion()
// 			} else if (event.key === 'ArrowRight') {
// 				nextQuestion()
// 			}
// 		}

// 		window.addEventListener('keydown', handleKeyDownArrow)

// 		return () => {
// 			window.removeEventListener('keydown', handleKeyDownArrow)
// 		}
// 	}, [currentQuestionIndex, tests, selectedAnswer])

// 	useEffect(() => {
// 		const handleKeyDown = (event: KeyboardEvent) => {
// 			const currentQuestion = tests[currentQuestionIndex]
// 			if (!currentQuestion || selectedAnswer) return

// 			// F1 dan F8 gacha tugmalarni qo'llash
// 			if (event.key === 'F1' && currentQuestion.testAnswers.length > 0) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[0].id)
// 			} else if (event.key === 'F2' && currentQuestion.testAnswers.length > 1) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[1].id)
// 			} else if (event.key === 'F3' && currentQuestion.testAnswers.length > 2) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[2].id)
// 			} else if (event.key === 'F4' && currentQuestion.testAnswers.length > 3) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[3].id)
// 			} else if (event.key === 'F5' && currentQuestion.testAnswers.length > 4) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[4].id)
// 			} else if (event.key === 'F6' && currentQuestion.testAnswers.length > 5) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[5].id)
// 			} else if (event.key === 'F7' && currentQuestion.testAnswers.length > 6) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[6].id)
// 			} else if (event.key === 'F8' && currentQuestion.testAnswers.length > 7) {
// 				event.preventDefault()
// 				handleAnswerSelect(currentQuestion.testAnswers[7].id)
// 			}
// 		}

// 		window.addEventListener('keydown', handleKeyDown)

// 		return () => {
// 			window.removeEventListener('keydown', handleKeyDown)
// 		}
// 	}, [currentQuestionIndex, tests, selectedAnswer])

// 	if (loading && tests.length === 0) {
// 		return (
// 			<div className='flex justify-center items-center min-h-screen'>
// 				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
// 			</div>
// 		)
// 	}

// 	if (error) {
// 		return (
// 			<div className='flex justify-center items-center min-h-screen'>
// 				<div className='text-center text-destructive'>
// 					<p className='text-xl'>{error}</p>
// 					<Button onClick={fetchTests} className='mt-4'>
// 						Qayta urinish
// 					</Button>
// 				</div>
// 			</div>
// 		)
// 	}

// 	if (tests.length === 0) {
// 		return (
// 			<div className='flex justify-center items-center min-h-screen'>
// 				<div className='text-center'>
// 					<p className='text-xl'>Savollar topilmadi</p>
// 					<Button onClick={fetchTests} className='mt-4'>
// 						Qayta urinish
// 					</Button>
// 				</div>
// 			</div>
// 		)
// 	}

// 	const currentQuestion = tests[currentQuestionIndex]

// 	return (
// 		<div className='min-h-screen mt-16 bg-background p-4 md:p-8 transition-colors duration-300'>
// 			<div className='max-w-screen-xl mx-auto space-y-6'>
// 				{/* Question Card */}
// 				<Card className='border-2 '>
// 					<CardHeader className='border-b bg-muted/50'>
// 						<Button className='w-fit' variant={'custom'}>
// 							<Link
// 								href={`${getLanguagePrefix()}`}
// 								className='flex items-center justify-center gap-2'
// 							>
// 								<ArrowLeft /> {t('ortga')}
// 							</Link>
// 						</Button>
// 						<br />
// 						<CardDescription>
// 							{t('savol')} {currentQuestionIndex + 1} / {tests.length}
// 						</CardDescription>
// 						<CardTitle className='text-xl'>
// 							{currentQuestion.question}
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent className='p-6'>
// 						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
// 							{/* Variantlar bo'limi */}
// 							<div className='order-2 lg:order-2 space-y-4'>
// 								<div className='grid gap-3'>
// 									{currentQuestion.testAnswers.map(answer => (
// 										<motion.div
// 											key={answer.id}
// 											whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
// 											whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
// 										>
// 											<Button
// 												variant='outline'
// 												className={`w-full  disabled:opacity-100 text-wrap justify-start text-left p-4 h-auto transition-all duration-300 border-2 ${
// 													selectedAnswer === answer.id && answer.isCorrect
// 														? 'bg-green-500 border-green-500 text-white hover:bg-green-700 hover:border-green-700'
// 														: selectedAnswer === answer.id && !answer.isCorrect
// 														? 'bg-red-500 border-red-500 text-white hover:bg-red-700 hover:border-red-700'
// 														: selectedAnswer && answer.isCorrect
// 														? 'bg-green-500 border-green-500 text-white hover:bg-green-700 hover:border-green-700'
// 														: 'hover:border-primary/50 hover:bg-accent/10'
// 												}`}
// 												onClick={() => handleAnswerSelect(answer.id)}
// 												disabled={!!selectedAnswer}
// 											>
// 												<div className='flex items-start gap-3'>
// 													{selectedAnswer && (
// 														<div className='mt-0.5'>
// 															{answer.isCorrect ? (
// 																<CheckCircle2 className='h-5 w-5 text-white' />
// 															) : selectedAnswer === answer.id ? (
// 																<XCircle className='h-5 w-5 text-white' />
// 															) : null}
// 														</div>
// 													)}
// 													<span className='text-base'>{answer.answerText}</span>
// 												</div>
// 											</Button>
// 										</motion.div>
// 									))}
// 								</div>

// 								{/* Controls */}
// 								{selectedAnswer && (
// 									<div className='flex items-center justify-end gap-2 pt-4'>
// 										<Button
// 											variant='outline'
// 											onClick={() => setShowExplanation(!showExplanation)}
// 											className='bg-yellow-500 hover:bg-primary/10 w-fit'
// 										>
// 											<Lightbulb className='h-4 w-4' /> <span>{t('izoh')}</span>
// 										</Button>
// 									</div>
// 								)}

// 								{/* Explanation */}
// 								<AnimatePresence>
// 									{showExplanation && selectedAnswer && (
// 										<motion.div
// 											initial={{ opacity: 0, height: 0 }}
// 											animate={{ opacity: 1, height: 'auto' }}
// 											exit={{ opacity: 0, height: 0 }}
// 											className={`p-4 rounded-sm border-1 ${
// 												isCorrect
// 													? 'bg-green-500/90 border-green-500'
// 													: 'bg-red-500/90 border-red-500'
// 											}`}
// 										>
// 											<p className='text-sm leading-relaxed'>
// 												{currentQuestion.explanation}
// 											</p>
// 										</motion.div>
// 									)}
// 								</AnimatePresence>
// 							</div>

// 							{/* Question Image */}
// 							<div className='order-1 lg:order-1'>
// 								<div className='sticky top-6'>
// 									{currentQuestion.mediaUrl ? (
// 										<div className='rounded-lg overflow-hidden border-1 shadow-xl'>
// 											{getImageUrl(currentQuestion.mediaUrl) && !imageError ? (
// 												<Image
// 													src={getImageUrl(currentQuestion.mediaUrl)!}
// 													alt={currentQuestion.question}
// 													width={600}
// 													height={400}
// 													className='w-full h-auto object-contain rounded-md max-h-[400px]'
// 													onError={() => setImageError(true)}
// 												/>
// 											) : (
// 												<div className='w-full h-[300px] bg-muted rounded flex items-center justify-center'>
// 													<ImageIcon className='h-16 w-16 text-muted-foreground' />
// 												</div>
// 											)}
// 										</div>
// 									) : (
// 										<Image
// 											src={'/avto6.webp'}
// 											alt={currentQuestion.question}
// 											width={600}
// 											height={400}
// 											className='w-full h-auto object-contain max-h-[400px]'
// 											onError={() => setImageError(true)}
// 										/>
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				{/* Navigation Buttons */}
// 				<div className='flex justify-between'>
// 					<Button
// 						variant='outline'
// 						onClick={prevQuestion}
// 						disabled={currentQuestionIndex === 0}
// 						className='transition-colors duration-300 border-2 hover:bg-primary/10'
// 					>
// 						<ChevronLeft className='mr-2 h-4 w-4' />
// 						{t('oldingisavol')}
// 					</Button>
// 					<div className='flex items-center gap-2'>
// 						<span className='text-green-600 font-medium'>{correctAnswers}</span>
// 						<span>/</span>
// 						<span>{totalAnswered}</span>
// 					</div>
// 					<Button
// 						onClick={nextQuestion}
// 						disabled={
// 							currentQuestionIndex === tests.length - 1 && !selectedAnswer
// 						}
// 						className='transition-colors duration-300 bg-primary hover:bg-primary/90'
// 					>
// 						{currentQuestionIndex === tests.length - 1
// 							? `${t('davometish')}`
// 							: `${t('keyingisavol')}`}
// 						<ChevronRight className='ml-2 h-4 w-4' />
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

'use client'

import { getCheckExem, IExamResult, ITestCase } from '@/lib/users'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	CheckCircle,
	XCircle,
	Calendar,
	Brain,
	Award,
	ChevronLeft,
	ChevronRight,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Image as ImageIcon,
} from 'lucide-react'
import Image from 'next/image'

function Page() {
	const pathname = usePathname()
	const examId = pathname.split('/')[5]
	const lang = pathname.split('/')[1]
	const [examResult, setExamResult] = useState<IExamResult>()
	const [loading, setLoading] = useState(true)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [showQuestions, setShowQuestions] = useState(false)

	useEffect(() => {
		const fetchCheckExam = async () => {
			try {
				setLoading(true)
				const response = await getCheckExem({ examId: examId, language: lang })
				setExamResult(response)
			} catch (error) {
				toast.error(`Imtixon natijalarini yuklashda xatolik: ${error}`)
			} finally {
				setLoading(false)
			}
		}
		fetchCheckExam()
	}, [lang, examId])

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return '/avto6.webp'

		if (!mediaUrl.includes('\\')) {
			return `http://213.230.109.74:8080/${mediaUrl}`
		}

		const filename = mediaUrl.split('\\').pop()
		return `http://213.230.109.74:8080/${filename}`
	}

	const nextQuestion = () => {
		if (
			examResult &&
			currentQuestionIndex < examResult.examTestCases.length - 1
		) {
			setCurrentQuestionIndex(prev => prev + 1)
		}
	}

	const prevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(prev => prev - 1)
		}
	}

	const isAnswerCorrect = (testCase: ITestCase) => {
		const selectedAnswer = testCase.testCase.testAnswers.find(
			answer => answer.id === testCase.selectedAnswerId
		)
		return selectedAnswer?.isCorrect || false
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
				<div className='max-w-4xl mx-auto'>
					<Card className='border-2'>
						<CardContent className='p-8'>
							<div className='space-y-6'>
								<div className='h-8 w-48 bg-muted animate-pulse rounded' />
								<div className='h-24 w-full bg-muted animate-pulse rounded' />
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{[1, 2, 3, 4].map(i => (
										<div
											key={i}
											className='h-16 bg-muted animate-pulse rounded'
										/>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	if (!examResult) return null

	const isPassed =
		(examResult.corrertAnswers / examResult.questionCount) * 100 >= 20
	const currentQuestion = examResult.examTestCases[currentQuestionIndex]

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 md:p-4'>
			<div className='max-w-6xl mx-auto space-y-5'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center space-y-2'
				>
					<h1 className='text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
						Imtixon natijalari
					</h1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}
				>
					<Card className='border-2'>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								<span className='text-2xl'>Natija</span>
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-2'>
										<Calendar className='h-3 w-3  text-sm' />
										<span className='text-sm'>
											{new Date(examResult.createAt).toLocaleDateString(
												'uz-UZ'
											)}
										</span>
									</div>
									<Badge variant={isPassed ? 'custom' : 'destructive'}>
										{isPassed ? "O'tdi" : "O'tmadi"}
									</Badge>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-8'>
							{/* Stats Grid */}
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className='flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10'
								>
									<div className='p-3 rounded-full bg-primary/10'>
										<CheckCircle className='h-6 w-6 text-green-500' />
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											To&apos;g&apos;ri javoblar
										</p>
										<p className='text-2xl font-bold text-green-500'>
											{examResult.corrertAnswers}
										</p>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className='flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10'
								>
									<div className='p-3 rounded-full bg-primary/10'>
										<XCircle className='h-6 w-6 text-red-500' />
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											Noto&apos;g&apos;ri javoblar
										</p>
										<p className='text-2xl font-bold text-red-500'>
											{examResult.questionCount - examResult.corrertAnswers}
										</p>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 }}
									className='flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10'
								>
									<div className='p-3 rounded-full bg-primary/10'>
										<Brain className='h-6 w-6 text-blue-500' />
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											Jami savollar
										</p>
										<p className='text-2xl font-bold text-blue-500'>
											{examResult.questionCount}
										</p>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 }}
									className='flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10'
								>
									<div className='p-3 rounded-full bg-primary/10'>
										<Award className='h-6 w-6 text-yellow-500' />
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>Foiz</p>
										<p className='text-2xl font-bold text-yellow-500'>
											{(
												(examResult.corrertAnswers / examResult.questionCount) *
												100
											).toFixed(1)}
											%
										</p>
									</div>
								</motion.div>
							</div>

							{/* Question Navigation */}
							<div className='space-y-4'>
								<Button
									onClick={() => setShowQuestions(!showQuestions)}
									className='w-full'
								>
									{showQuestions
										? 'Savollarni yashirish'
										: "Savollarni ko'rish"}
								</Button>

								{showQuestions && (
									<div className='grid grid-cols-5 md:grid-cols-10 gap-2'>
										{examResult.examTestCases.map((testCase, index) => (
											<Button
												key={testCase.id}
												variant={
													currentQuestionIndex === index ? 'default' : 'outline'
												}
												className={`aspect-square ${
													isAnswerCorrect(testCase)
														? 'bg-green-500/20 hover:bg-green-500/30 border-green-500'
														: 'bg-red-500/20 hover:bg-red-500/30 border-red-500'
												}`}
												onClick={() => setCurrentQuestionIndex(index)}
											>
												{index + 1}
											</Button>
										))}
									</div>
								)}
							</div>

							{/* Question Details */}
							<AnimatePresence mode='wait'>
								{showQuestions && (
									<motion.div
										key={currentQuestionIndex}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										className='space-y-6'
									>
										<Card>
											<CardHeader>
												<CardTitle className='flex items-center justify-between'>
													<span>Savol {currentQuestionIndex + 1}</span>
													<Badge
														variant={
															isAnswerCorrect(currentQuestion)
																? 'default'
																: 'destructive'
														}
													>
														{isAnswerCorrect(currentQuestion)
															? "To'g'ri"
															: "Noto'g'ri"}
													</Badge>
												</CardTitle>
											</CardHeader>
											<CardContent className='space-y-6'>
												<p className='text-lg'>
													{currentQuestion.testCase.question}
												</p>

												<div className='w-full flex flex-col md:flex-row items-start justify-between gap-4'>
													{currentQuestion.testCase.mediaUrl && (
														<div className='w-full md:w-1/2 rounded-lg overflow-hidden border'>
															<Image
																src={getImageUrl(
																	currentQuestion.testCase.mediaUrl
																)}
																alt='Question'
																width={600}
																height={400}
																className='w-full h-auto object-contain max-h-[300px]'
															/>
														</div>
													)}

													<div className='w-full md:w-1/2 space-y-3'>
														{currentQuestion.testCase.testAnswers.map(
															answer => (
																<div
																	key={answer.id}
																	className={`p-4 rounded-lg border ${
																		answer.id ===
																		currentQuestion.selectedAnswerId
																			? answer.isCorrect
																				? 'bg-green-500/20 border-green-500'
																				: 'bg-red-500/20 border-red-500'
																			: answer.isCorrect
																			? 'bg-green-500/20 border-green-500'
																			: ''
																	}`}
																>
																	<div className='flex items-center gap-2'>
																		{answer.id ===
																			currentQuestion.selectedAnswerId &&
																			(answer.isCorrect ? (
																				<CheckCircle className='h-5 w-5 text-green-500' />
																			) : (
																				<XCircle className='h-5 w-5 text-red-500' />
																			))}
																		<span>{answer.answerText}</span>
																	</div>
																</div>
															)
														)}
													</div>
												</div>

												<p className='text-sm text-muted-foreground mt-4'>
													{currentQuestion.testCase.explanation}
												</p>
											</CardContent>
										</Card>

										<div className='flex justify-between'>
											<Button
												variant='outline'
												onClick={prevQuestion}
												disabled={currentQuestionIndex === 0}
											>
												<ChevronLeft className='mr-2 h-4 w-4' />
												Oldingi savol
											</Button>
											<Button
												variant='outline'
												onClick={nextQuestion}
												disabled={
													currentQuestionIndex ===
													examResult.examTestCases.length - 1
												}
											>
												Keyingi savol
												<ChevronRight className='ml-2 h-4 w-4' />
											</Button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Result Animation */}
							{!showQuestions && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.7, type: 'spring' }}
									className='flex justify-center'
								>
									<Image
										src={isPassed ? '/success.png' : '/try-again.webp'}
										alt='Result'
										width={200}
										height={200}
										className='drop-shadow-xl'
									/>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	)
}

export default Page

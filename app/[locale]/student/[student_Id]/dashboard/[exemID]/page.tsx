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
	ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function Page() {
	const pathname = usePathname()
	const examId = pathname.split('/')[5]
	const lang = pathname.split('/')[1]
	const getUserId = pathname.split('/')[3]
	const [examResult, setExamResult] = useState<IExamResult>()
	const [loading, setLoading] = useState(true)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const t = useTranslations('Student')
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

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
			return `${process.env.NEXT_PUBLIC_API_URL}/${mediaUrl}`
		}

		const filename = mediaUrl.split('\\').pop()
		return `${process.env.NEXT_PUBLIC_API_URL}/${filename}`
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
		(examResult.corrertAnswers / examResult.questionCount) * 100 >= 90
	const currentQuestion = examResult.examTestCases[currentQuestionIndex]

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 md:p-4'>
			<div className='max-w-6xl mx-auto space-y-5'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center space-y-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4'
				>
					{/* Buttons Section */}
					<div className='flex flex-col sm:flex-row items-center justify-center gap-3 w-full md:w-auto'>
						<Button variant={'custom'} className='w-full sm:w-auto'>
							<Link
								href={`${getLanguagePrefix()}/student/${getUserId}/dashboard`}
								className='flex items-center justify-center gap-2 p-2'
							>
								<ArrowLeft /> {t('barchanatijalar')}
							</Link>
						</Button>
						<Button variant={'custom'} className='w-full sm:w-auto'>
							<Link
								href={`${getLanguagePrefix()}/student/${getUserId}`}
								className='flex items-center justify-center gap-2 p-2'
							>
								{t('testishlash')}
							</Link>
						</Button>
					</div>

					{/* Title Section */}
					<h1 className='text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 text-center flex-grow'>
						{t('imtixonnatijalari')}
					</h1>

					{/* Date and Badge Section */}
					<div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full md:w-auto'>
						<div className='flex items-center gap-2'>
							<Calendar className='h-3 w-3 text-sm' />
							<span className='text-sm'>
								{new Date(examResult.createAt).toLocaleDateString('uz-UZ')}
							</span>
						</div>
						<Badge variant={isPassed ? 'custom' : 'destructive'}>
							{isPassed ? `${t('topshirdi')}` : `${t('topshirmadi')}`}
						</Badge>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}
				>
					<Card className='border-2'>
						<CardHeader></CardHeader>
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
											{t('togrijavoblar')}
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
											{t('notogrijavoblar')}
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
											{t('jamisavollar')}
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
										<p className='text-sm text-muted-foreground'>
											{' '}
											{t('foiz')}
										</p>
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
								<div className='grid grid-cols-5 md:grid-cols-20 gap-1'>
									{examResult.examTestCases.map((testCase, index) => (
										<Button
											key={testCase.id}
											variant={
												currentQuestionIndex === index ? 'default' : 'outline'
											}
											className={`aspect-square ${
												isAnswerCorrect(testCase)
													? 'bg-green-500 hover:bg-green-500 border-green-500'
													: 'bg-red-500 hover:bg-red-500 border-red-500'
											}`}
											onClick={() => setCurrentQuestionIndex(index)}
										>
											{index + 1}
										</Button>
									))}
								</div>
							</div>

							{/* Question Details */}
							<AnimatePresence mode='wait'>
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
												<span>
													{t('savol')} {currentQuestionIndex + 1}
												</span>
												<Badge
													variant={
														isAnswerCorrect(currentQuestion)
															? 'custom'
															: 'destructive'
													}
													className='text-sm'
												>
													{isAnswerCorrect(currentQuestion)
														? `${t('togri')}`
														: `${t('notogri')}`}
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
													{currentQuestion.testCase.testAnswers.map(answer => (
														<div
															key={answer.id}
															className={`p-4 rounded-lg border ${
																answer.id === currentQuestion.selectedAnswerId
																	? answer.isCorrect
																		? 'bg-green-500 border-green-500'
																		: 'bg-red-500 border-red-500'
																	: answer.isCorrect
																	? 'bg-green-500 border-green-500'
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
													))}
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
											{t('oldingisavol')}
										</Button>
										<Button
											variant='outline'
											onClick={nextQuestion}
											disabled={
												currentQuestionIndex ===
												examResult.examTestCases.length - 1
											}
										>
											{t('keyingisavol')}
											<ChevronRight className='ml-2 h-4 w-4' />
										</Button>
									</div>
								</motion.div>
							</AnimatePresence>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	)
}

export default Page

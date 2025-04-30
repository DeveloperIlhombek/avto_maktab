'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { getAllTestsAdmin } from '@/lib/test'
import type { Test } from '@/lib/test'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function PracticePage() {
	const t = useTranslations('Practise')
	const pathname = usePathname()
	const language = pathname.split('/')[1]
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	const [tests, setTests] = useState<Test[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchTests()
	}, [language])

	const fetchTests = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getAllTestsAdmin(0, 5000, language)

			if (response.isSuccess) {
				setTests(response.result.items)
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

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				prevQuestion()
			} else if (event.key === 'ArrowRight') {
				event.preventDefault()
				nextQuestion()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [currentQuestionIndex])
	const nextQuestion = () => {
		if (currentQuestionIndex < tests.length - 1) {
			setCurrentQuestionIndex(prev => prev + 1)
		}
	}

	const prevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(prev => prev - 1)
		}
	}

	const resetPractice = () => {
		setCurrentQuestionIndex(0)
	}

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return null
		if (mediaUrl.startsWith('Files/')) {
			return `${process.env.NEXT_PUBLIC_API_URL}/${mediaUrl}`
		}
		return null
	}

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin rounded-full h-16 w-16 border-b-4 border-green-500'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-center text-destructive'>
					<p className='text-xl'>{error}</p>
					<Button
						variant={'custom'}
						className='flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300'
					>
						<Link
							href={`${getLanguagePrefix()}`}
							className='flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
						>
							<ArrowLeft className='w-5 h-5' /> {t('ortga')}
						</Link>
					</Button>
					<Button onClick={fetchTests} className='mt-4'>
						{t('qaytaurinish')}
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
						{t('qaytaurinish')}
					</Button>
					<Button
						variant={'custom'}
						className='flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300'
					>
						<Link
							href={`${getLanguagePrefix()}`}
							className='flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
						>
							<ArrowLeft className='w-5 h-5' /> {t('ortga')}
						</Link>
					</Button>
				</div>
			</div>
		)
	}

	const currentQuestion = tests[currentQuestionIndex]

	return (
		<main className='min-h-screen py-4 px-2 md:p-2 bg-background transition-colors duration-300'>
			<div className='max-w-screen-xl h-[80%] mx-auto space-y-6'>
				<Card className='shadow-lg rounded-lg overflow-hidden'>
					<CardHeader className='p-4 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm dark:shadow-gray-800/50'>
						<div className='flex items-center justify-between gap-4 mb-6'>
							{/* Back Button */}
							<Button
								variant={'custom'}
								className='flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300'
							>
								<Link
									href={`${getLanguagePrefix()}`}
									className='flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
								>
									<ArrowLeft className='w-5 h-5' /> {t('ortga')}
								</Link>
							</Button>

							{/* Reset Button */}
							<Button
								onClick={() => resetPractice()}
								size={'default'}
								variant={'custom'}
								className='flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300'
							>
								<RefreshCw className='w-5 h-5' />
								{t('qaytaboshlash')}
							</Button>
						</div>

						{/* Title */}
						<CardTitle className='text-center text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4'>
							{t('savoljavoblar')}
						</CardTitle>

						{/* Question Description */}
						<CardDescription className='text-xl py-4 bg-red-500 text-white dark:text-gray-300 text-center leading-relaxed'>
							{currentQuestion.question}
						</CardDescription>
					</CardHeader>
					<div className='flex flex-col md:flex-row justify-between items-center gap-6 p-6'>
						<CardContent className='flex-1 w-full md:w-auto'>
							{currentQuestion.mediaUrl === null ||
							currentQuestion.mediaUrl === '1' ? (
								<Image
									src={'/avto6.webp'}
									alt='default-image'
									width={400}
									height={400}
									className='rounded-md shadow-sm w-full h-auto'
								/>
							) : (
								getImageUrl(currentQuestion.mediaUrl) && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5 }}
									>
										<Image
											src={getImageUrl(currentQuestion.mediaUrl) || ''}
											alt={currentQuestion.name || ''}
											width={500}
											height={500}
											className='rounded-md shadow-sm w-full h-auto'
										/>
									</motion.div>
								)
							)}
						</CardContent>
						<CardContent className='flex-1 w-full md:w-auto flex flex-col items-start gap-4'>
							<CardDescription className='text-lg font-semibold'>
								{`${currentQuestion.number}` + ' - ' + t('savoljavobi')}
							</CardDescription>
							<AnimatePresence mode='popLayout'>
								{currentQuestion.testAnswers
									.filter(answer => answer.isCorrect)
									.map(answer => (
										<motion.div
											key={answer.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.3 }}
											className='font-medium bg-green-500 border border-green-500 p-4 w-full rounded-md'
										>
											{answer.answerText}
										</motion.div>
									))}
							</AnimatePresence>
							<div>
								<CardDescription className='text-lg font-semibold'>
									{t('izoh')}
								</CardDescription>
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className='text-muted-foreground mt-4 border border-green-400 w-full p-4 rounded-md'
								>
									{currentQuestion.explanation}
								</motion.div>
							</div>

							<div className='flex items-end content-end justify-between gap-3 w-full mt-4'>
								<Button
									className='w-1/2'
									variant={'custom'}
									onClick={() => prevQuestion()}
								>
									<ChevronLeft />
									{t('oldingi')}
								</Button>
								<Button
									className='w-1/2'
									variant={'custom'}
									onClick={() => nextQuestion()}
								>
									{t('keyingi')}
									<ChevronRight />
								</Button>
							</div>
						</CardContent>
					</div>
				</Card>
			</div>
		</main>
	)
}

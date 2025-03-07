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
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { getAllTestsAdmin } from '@/lib/test'
import type { Test } from '@/lib/test'

export default function PracticePage() {
	const [tests, setTests] = useState<Test[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	useEffect(() => {
		fetchTests()
	}, [language])

	const fetchTests = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getAllTestsAdmin(0, 100, language)

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
			return `http://213.230.109.74:8080/${mediaUrl}`
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
		<main className='min-h-screen p-4 md:p-8 bg-background transition-colors duration-300'>
			<div className='max-w-screen-xl h-[80%] mx-auto space-y-6'>
				<Card className='relative shadow-lg rounded-lg overflow-hidden'>
					<CardHeader className='p-6 md:p-12'>
						<Button
							onClick={() => resetPractice()}
							size={'default'}
							variant={'custom'}
							className='mt-16 w-fit'
						>
							<RefreshCw />
						</Button>
						<CardTitle className='text-center text-2xl font-bold mb-4'>
							Savol - Javoblar
						</CardTitle>

						<CardDescription className='text-xl text-muted-foreground'>
							{currentQuestion.question}
						</CardDescription>
					</CardHeader>
					<div className='flex flex-col md:flex-row justify-between items-center gap-6 p-6'>
						<CardContent className='flex-1 w-full md:w-auto'>
							{currentQuestion.mediaUrl === null ||
							currentQuestion.mediaUrl === '1' ? (
								<Image
									src={'/testbox.svg'}
									alt='default-image'
									width={500}
									height={500}
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
								Savol Javobi:
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
											className='font-medium border border-green-300 p-4 w-full rounded-md'
										>
											{answer.answerText}
										</motion.div>
									))}
							</AnimatePresence>
							<div>
								<CardDescription className='text-lg font-semibold'>
									Izoh:
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
									Preview
								</Button>
								<Button
									className='w-1/2'
									variant={'custom'}
									onClick={() => nextQuestion()}
								>
									Next
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

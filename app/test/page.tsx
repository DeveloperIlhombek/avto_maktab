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
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { testData } from '@/constanta'

// Mock test data

export default function TestPage() {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	//const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
	const [timeLeft, setTimeLeft] = useState(testData.duration)
	const [answers, setAnswers] = useState<(number | null)[]>(
		new Array(testData.questions.length).fill(null)
	)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 0) {
					clearInterval(timer)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`
	}

	const handleAnswerSelect = (index: number) => {
		//setSelectedAnswer(index)
		const newAnswers = [...answers]
		newAnswers[currentQuestion] = index
		setAnswers(newAnswers)

		// Play sound effect
		const audio = new Audio(
			index === testData.questions[currentQuestion].correctAnswer
				? '/correct.mp3'
				: '/incorrect.mp3'
		)
		audio.play()
	}

	const progress = (timeLeft / testData.duration) * 100

	const getTimerColor = () => {
		if (timeLeft <= 10) return 'text-red-500'
		if (timeLeft <= 60) return 'text-yellow-500'
		return 'text-green-500'
	}

	const getCircleColor = () => {
		if (timeLeft <= 10) return 'stroke-red-500'
		if (timeLeft <= 60) return 'stroke-yellow-500'
		return 'stroke-green-500'
	}

	const getAnswerStyle = (answerIndex: number) => {
		const correctAnswer = testData.questions[currentQuestion].correctAnswer
		const selectedAnswer = answers[currentQuestion]

		if (selectedAnswer === null) return ''
		if (answerIndex === correctAnswer && selectedAnswer !== correctAnswer)
			return 'bg-yellow-500/20 border-yellow-500'
		if (answerIndex === correctAnswer) return 'bg-green-500/20 border-green-500'
		if (answerIndex === selectedAnswer) return 'bg-red-500/20 border-red-500'
		return ''
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
						transition={{ duration: testData.duration, ease: 'linear' }}
						className='w-full'
					>
						<Image src='/car.png' alt='Car' width={80} height={40} />
					</motion.div>
				</div>

				{/* Question Navigation */}
				<div className='flex items-center justify-between'>
					<div className='relative w-20 h-20'>
						<svg className='w-full h-full' viewBox='0 0 100 100'>
							<circle
								className='text-muted stroke-current'
								strokeWidth='8'
								fill='none'
								r='44'
								cx='50'
								cy='50'
							/>
							<circle
								className={`${getCircleColor()} transition-colors duration-300`}
								strokeWidth='8'
								fill='none'
								r='44'
								cx='50'
								cy='50'
								strokeDasharray={`${(progress * 276.32) / 100} 276.32`}
								transform='rotate(-90 50 50)'
							/>
						</svg>
						<div className='absolute inset-0 flex items-center justify-center'>
							<span
								className={`text-2xl font-bold ${getTimerColor()} transition-colors duration-300`}
							>
								{formatTime(timeLeft)}
							</span>
						</div>
					</div>

					<div className='flex-1 px-8'>
						<div className='flex items-center justify-center gap-2 flex-wrap'>
							{answers.map((answer, index) => (
								<Button
									key={index}
									variant={currentQuestion === index ? 'default' : 'outline'}
									className={`w-10 h-10 ${
										answer !== null
											? answer === testData.questions[index].correctAnswer
												? 'bg-green-500/10 hover:bg-green-500/20 text-green-500'
												: 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
											: ''
									}`}
									onClick={() => setCurrentQuestion(index)}
								>
									{index + 1}
								</Button>
							))}
						</div>
					</div>

					<Button variant='destructive'>Testni yakunlash</Button>
				</div>

				{/* Question Card */}
				<Card className='border-2'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-2xl'>
								Savol {currentQuestion + 1} / {testData.questions.length}
							</CardTitle>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant='ghost' size='icon' className='flex flex-col'>
										<Image
											src={'/bulb.png'}
											alt='bulb '
											width={40}
											height={40}
										/>
										Izoh
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className='text-2xl'>Izoh:</DialogTitle>
										<DialogDescription className='flex item-center justify-center gap-4'>
											<Image
												src={'/teacher.jpg'}
												alt='teacher'
												width={200}
												height={200}
											/>
											<span className='font-bold'>
												{testData.questions[currentQuestion].explanation}
											</span>
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</div>
						<CardDescription className='text-lg'>
							{testData.questions[currentQuestion].question}
						</CardDescription>
					</CardHeader>
					<CardContent className='grid md:grid-cols-2 gap-8'>
						<div className='relative rounded-lg overflow-hidden'>
							<Image
								src={testData.questions[currentQuestion].image}
								alt='question'
								className='w-full h-full object-cover'
								width={300}
								height={300}
							/>
						</div>

						<div className='space-y-4'>
							{testData.questions[currentQuestion].options.map(
								(option, index) => (
									<motion.div
										key={index}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											variant='outline'
											className={`w-full justify-start text-left p-4 h-auto ${getAnswerStyle(
												index
											)}`}
											onClick={() => handleAnswerSelect(index)}
											disabled={answers[currentQuestion] !== null}
										>
											{answers[currentQuestion] === index && (
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className='mr-2'
												>
													{index ===
													testData.questions[currentQuestion].correctAnswer ? (
														<CheckCircle className='h-5 w-5 text-green-500' />
													) : (
														<XCircle className='h-5 w-5 text-red-500' />
													)}
												</motion.div>
											)}
											{option}
										</Button>
									</motion.div>
								)
							)}
						</div>
					</CardContent>
				</Card>

				{/* Navigation Buttons */}
				<div className='flex justify-between'>
					<Button
						variant='outline'
						onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
						disabled={currentQuestion === 0}
					>
						<ChevronLeft className='mr-2 h-4 w-4' />
						Oldingi savol
					</Button>
					<Button
						onClick={() =>
							setCurrentQuestion(prev =>
								Math.min(testData.questions.length - 1, prev + 1)
							)
						}
						disabled={currentQuestion === testData.questions.length - 1}
					>
						Keyingi savol
						<ChevronRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}

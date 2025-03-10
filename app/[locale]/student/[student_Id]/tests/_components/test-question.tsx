'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import type { Test } from '@/lib/test'

interface TestQuestionProps {
	question: Test
	selectedAnswer: number | null
	onAnswerSelect: (index: number) => void
	isCompleted: boolean
	isDisabled: boolean
}
const getImageUrl = (mediaUrl: string | null) => {
	if (!mediaUrl || mediaUrl === '1') return '/testbox.svg'

	if (!mediaUrl.includes('\\')) {
		return `http://213.230.109.74:8080/${mediaUrl}`
	}

	const filename = mediaUrl.split('\\').pop()
	return `http://213.230.109.74:8080/${filename}`
}
export function TestQuestion({
	question,
	selectedAnswer,
	onAnswerSelect,
	isCompleted,
	isDisabled,
}: TestQuestionProps) {
	return (
		<Card className='border-2'>
			<CardHeader>
				<CardTitle className='text-2xl'>{question.question}</CardTitle>
				{question.mediaUrl && (
					<div className='relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden'>
						<Image
							src={getImageUrl(question.mediaUrl)}
							alt='Question media'
							fill
							className='object-contain bg-accent/50'
						/>
					</div>
				)}
			</CardHeader>
			<CardContent className='space-y-4'>
				{question.testAnswersForUser?.map((answer, index) => {
					const isSelected = selectedAnswer === index
					const isCorrect = answer.isCorrect

					return (
						<motion.button
							key={answer.id}
							whileHover={{ scale: isDisabled ? 1 : 1.01 }}
							whileTap={{ scale: isDisabled ? 1 : 0.99 }}
							onClick={() => !isDisabled && onAnswerSelect(index)}
							disabled={isDisabled}
							className={`
                w-full p-4 rounded-lg text-left flex items-center gap-3
                ${isSelected ? 'border-primary' : 'border-input'}
                ${
									isCompleted && isSelected
										? isCorrect
											? 'bg-green-500/10 border-green-500'
											: 'bg-red-500/10 border-red-500'
										: 'hover:bg-accent'
								}
                transition-colors
                ${
									isDisabled
										? 'cursor-not-allowed opacity-50'
										: 'cursor-pointer'
								}
              `}
						>
							{isCompleted && isSelected && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className='flex-shrink-0'
								>
									{isCorrect ? (
										<CheckCircle className='h-5 w-5 text-green-500' />
									) : (
										<XCircle className='h-5 w-5 text-red-500' />
									)}
								</motion.div>
							)}
							<span className='text-base'>{answer.answer}</span>
						</motion.button>
					)
				})}
			</CardContent>
		</Card>
	)
}

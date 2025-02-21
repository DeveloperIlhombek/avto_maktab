'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

interface ResultDialogProps {
	isOpen: boolean
	onClose: () => void
	onRestart: () => void
	results: {
		correctAnswers: number
		totalQuestions: number
		percentage: number
	}
}

export function ResultDialog({
	isOpen,
	onClose,
	onRestart,
	results,
}: ResultDialogProps) {
	const isPassed = results.percentage >= 90

	return (
		<Dialog open={isOpen}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-2xl'>Test natijalari</DialogTitle>
					<div>
						{isPassed ? (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className='flex items-center gap-2 text-green-500'
							>
								<CheckCircle className='h-6 w-6' />
								<span>
									Tabriklaymiz! Siz testdan muvaffaqiyatli o&apos;tdingiz!
								</span>
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className='flex items-center gap-2 text-red-500'
							>
								<XCircle className='h-6 w-6' />
								<span>Afsuski, siz testdan o&apos;ta olmadingiz.</span>
							</motion.div>
						)}
					</div>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<div className='flex justify-between text-lg'>
							<span>To&apos;g&apos;ri javoblar:</span>
							<span className='font-bold text-green-500'>
								{results.correctAnswers}
							</span>
						</div>
						<div className='flex justify-between text-lg'>
							<span>Noto&apos;g&apos;ri javoblar:</span>
							<span className='font-bold text-red-500'>
								{results.totalQuestions - results.correctAnswers}
							</span>
						</div>
						<div className='flex justify-between text-lg'>
							<span>Foiz:</span>
							<span className='font-bold'>
								{results.percentage.toFixed(1)}%
							</span>
						</div>
					</div>
					<div className='flex justify-end gap-2'>
						<Button onClick={onClose} variant='outline'>
							Yopish
						</Button>
						<Button
							onClick={onRestart}
							className='bg-blue-500 hover:bg-blue-600'
						>
							Qayta boshlash
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

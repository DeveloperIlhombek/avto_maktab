'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface StartDialogProps {
	isOpen: boolean
	onStart: (questionCount: number) => void
}

export function StartDialog({ isOpen, onStart }: StartDialogProps) {
	const [questionCount, setQuestionCount] = useState(20)
	const [error, setError] = useState('')

	const handleStart = () => {
		if (questionCount < 20) {
			setError('Minimal 20 ta savol tanlash kerak')
			return
		}
		if (questionCount > 50) {
			setError('Maksimal 50 ta savol tanlash mumkin')
			return
		}
		setError('')
		onStart(questionCount)
	}

	return (
		<Dialog open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Test ishlashni boshlash</DialogTitle>
					<DialogDescription>
						Nechta savol yechmoqchi ekanligingizni kiriting (20-50)
					</DialogDescription>
				</DialogHeader>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-4'
				>
					<div className='space-y-2'>
						<Input
							type='number'
							min={20}
							max={50}
							value={questionCount}
							onChange={e => {
								setQuestionCount(parseInt(e.target.value, 10))
								setError('')
							}}
							className='text-lg'
						/>
						{error && <p className='text-sm text-destructive'>{error}</p>}
						<p className='text-sm text-muted-foreground'>
							Minimal: 20 ta, Maksimal: 50 ta savol
						</p>
					</div>
				</motion.div>
				<DialogFooter>
					<Button onClick={handleStart} size='lg'>
						Boshlash
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

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

interface StartDialogProps {
	isOpen: boolean
	onStart: (questionCount: number) => void
	maxQuestions: number
}

export function StartDialog({
	isOpen,
	onStart,
	maxQuestions,
}: StartDialogProps) {
	const [questionCount, setQuestionCount] = useState(20)

	const handleStart = () => {
		if (questionCount > 0 && questionCount <= maxQuestions) {
			onStart(questionCount)
		}
	}

	return (
		<Dialog open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Test ishlashni boshlash</DialogTitle>
					<DialogDescription>
						Nechta savol yechmoqchi ekanligingizni kiriting
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Input
							type='number'
							min={1}
							max={maxQuestions}
							value={questionCount}
							onChange={e => setQuestionCount(parseInt(e.target.value, 10))}
						/>
						<p className='text-sm text-muted-foreground'>
							Maksimal savollar soni: {maxQuestions}
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleStart}>Boshlash</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

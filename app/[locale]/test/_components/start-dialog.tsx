'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StartDialogProps {
	isOpen: boolean
	onStart: (questionCount: number) => void
}

export function StartDialog({ isOpen, onStart }: StartDialogProps) {
	const [questionCount, setQuestionCount] = useState(20)
	return (
		<Dialog open={isOpen}>
			<DialogContent className='w-80 mx-6'>
				<DialogHeader>
					<DialogTitle className='text-2xl'>Test boshlash</DialogTitle>
					<DialogDescription>
						Nechta test savolini yechmoqchisiz?
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Input
							type='number'
							min={10}
							value={questionCount}
							onChange={e => setQuestionCount(Number(e.target.value))}
							className='text-center text-lg'
						/>
						<p className='text-sm text-muted-foreground text-center'>
							10 tadan ortiq savol tanlang
						</p>
					</div>
					<div className='flex justify-end'>
						<Button onClick={() => onStart(questionCount)}>Boshlash</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

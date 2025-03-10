'use client'

import { motion } from 'framer-motion'

interface TimerProps {
	timeLeft: number
	duration: number
}

export function Timer({ timeLeft, duration }: TimerProps) {
	const progress = (timeLeft / duration) * 100

	const getTimerColor = () => {
		if (timeLeft <= 10) return 'text-red-500'
		if (timeLeft <= 30) return 'text-yellow-500'
		return 'text-green-500'
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	return (
		<div className='relative w-20 h-20'>
			<svg className='w-full h-full -rotate-90'>
				<circle
					className='text-muted stroke-current'
					strokeWidth='8'
					fill='transparent'
					r='32'
					cx='40'
					cy='40'
				/>
				<motion.circle
					className={getTimerColor()}
					strokeWidth='8'
					fill='transparent'
					r='32'
					cx='40'
					cy='40'
					strokeDasharray={`${(progress * 201) / 100} 201`}
				/>
			</svg>
			<div className='absolute inset-0 flex items-center justify-center'>
				<span className={`text-xl font-bold ${getTimerColor()}`}>
					{formatTime(timeLeft)}
				</span>
			</div>
		</div>
	)
}

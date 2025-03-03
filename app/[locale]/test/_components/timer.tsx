'use client'

import { motion } from 'framer-motion'

interface TimerProps {
	timeLeft: number
	duration: number
	questionCount: number
}

export function Timer({ timeLeft, duration, questionCount }: TimerProps) {
	const progress = (timeLeft / (questionCount * duration)) * 100

	const getTimerColor = () => {
		if (timeLeft <= 10) return 'text-red-500 dark:text-red-400'
		if (timeLeft <= 60) return 'text-yellow-500 dark:text-yellow-400'
		return 'text-green-500 dark:text-green-400'
	}

	const getCircleColor = () => {
		if (timeLeft <= 10) return 'stroke-red-500 dark:stroke-red-400'
		if (timeLeft <= 60) return 'stroke-yellow-500 dark:stroke-yellow-400'
		return 'stroke-green-500 dark:stroke-green-400'
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`
	}

	return (
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
				<motion.circle
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
	)
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
	timeLeft: number
	totalTime: number
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
	const [color, setColor] = useState('bg-green-500') // Boshlang'ich rang
	const progress = (timeLeft / totalTime) * 100

	useEffect(() => {
		if (timeLeft <= 10) {
			setColor('bg-red-500')
		} else if (timeLeft <= 60) {
			setColor('bg-yellow-500')
		} else {
			setColor('bg-green-500')
		}
	}, [timeLeft])

	const minutes = Math.floor(timeLeft / 60)
	const seconds = timeLeft % 60

	return (
		<div className='relative w-40 h-10 bg-gray-200 rounded-full overflow-hidden'>
			<motion.div
				className={`absolute top-0 left-0 h-full ${color} transition-colors duration-300`}
				style={{ width: `${progress}%` }}
				initial={{ width: '100%' }}
				animate={{ width: `${progress}%` }}
				transition={{ duration: 0.5 }}
			/>
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
				<span className='text-2xl font-bold text-gray-800'>
					{minutes}:{seconds.toString().padStart(2, '0')}
				</span>
			</div>
		</div>
	)
}

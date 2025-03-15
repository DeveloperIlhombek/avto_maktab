'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
	timeLeft: number
	totalTime: number
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
	const [color, setColor] = useState('bg-green-500')
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
		<div className='relative w-20 h-20'>
			<svg className='w-full h-full' viewBox='0 0 100 100'>
				<circle
					className='text-gray-200 stroke-current'
					strokeWidth='10'
					cx='50'
					cy='50'
					r='40'
					fill='transparent'
				/>
				<motion.circle
					className={`stroke-current ${color} transition-colors duration-300`}
					strokeWidth='10'
					strokeLinecap='round'
					cx='50'
					cy='50'
					r='40'
					fill='transparent'
					strokeDasharray={251.2}
					strokeDashoffset={251.2 - (251.2 * progress) / 100}
					transform='rotate(-90 50 50)'
					initial={{ strokeDashoffset: 251.2 }}
					animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
					transition={{ duration: 0.5 }}
				/>
			</svg>
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
				<span className='text-lg font-bold'>
					{minutes}:{seconds.toString().padStart(2, '0')}
				</span>
			</div>
		</div>
	)
}

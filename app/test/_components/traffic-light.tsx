// 'use client'

// import { motion } from 'framer-motion'

// interface TrafficLightProps {
// 	onComplete: () => void
// }

// export function TrafficLight({ onComplete }: TrafficLightProps) {
// 	return (
// 		<div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'>
// 			<div className='bg-card p-8 rounded-lg shadow-lg'>
// 				<div className='flex flex-col gap-4 items-center'>
// 					<motion.div
// 						className='w-24 h-24 rounded-full bg-red-500'
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: [0, 1, 0] }}
// 						transition={{ duration: 1, times: [0, 0.5, 1] }}
// 					/>
// 					<motion.div
// 						className='w-24 h-24 rounded-full bg-yellow-500'
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: [0, 1, 0] }}
// 						transition={{ duration: 1, delay: 1, times: [0, 0.5, 1] }}
// 					/>
// 					<motion.div
// 						className='w-24 h-24 rounded-full bg-green-500'
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: [0, 1] }}
// 						transition={{ duration: 1, delay: 2 }}
// 						onAnimationComplete={onComplete}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Home() {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	}

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
			},
		},
	}

	return (
		<div className='mt-24 min-h-[70vh] bg-background flex items-center'>
			<div className='container mx-auto'>
				<motion.div
					variants={container}
					initial='hidden'
					animate='show'
					className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
				>
					{/* Left Content */}
					<div className='space-y-6'>
						<motion.h1
							variants={item}
							className='text-4xl md:text-6xl font-bold tracking-tight'
						>
							E-AVTOMAKTAB
						</motion.h1>
						<motion.p
							variants={item}
							className='text-lg md:text-xl text-muted-foreground max-w-[600px]'
						>
							Onlayn masofaviy ta&apos;lim platformasi
						</motion.p>
						<motion.div variants={item}>
							<Button size='lg' className='text-lg px-8'>
								Tizimga kirish
							</Button>
						</motion.div>
					</div>

					{/* Right Animation */}
					<motion.div
						variants={item}
						className='relative h-[300px] md:h-[500px]'
					>
						<motion.img
							src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1470&auto=format&fit=crop'
							alt='Driving School'
							className='rounded-lg object-cover w-full h-full'
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 rounded-lg' />
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}

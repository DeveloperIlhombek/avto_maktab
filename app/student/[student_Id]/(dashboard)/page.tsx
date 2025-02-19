'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
//import { Progress } from "@/components/ui/progress";
import { Clock, Trophy } from 'lucide-react'

// Mock data
const studentData = {
	name: 'Aziz Rahimov',
	testResults: {
		total: 100,
		correct: 85,
	},
	nextLesson: {
		type: 'Amaliy',
		date: '2024-03-20',
		time: '14:00',
		instructor: 'Akmal Karimov',
	},
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
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

export default function StudentDashboard() {
	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='space-y-8'
		>
			{/* Welcome Section */}
			<motion.div
				variants={item}
				className='relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-100 via-green-200 to-green-100 p-8 border shadow-lg'
			>
				<div className='absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/5' />
				<h1 className='text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
					Xush kelibsiz, {studentData.name}!
				</h1>
				<p className='text-muted-foreground text-lg'>
					Bugungi yutuqlaringizni ko&apos;rib chiqing
				</p>
			</motion.div>

			{/* Test Results */}
			<motion.div variants={item}>
				<Card className='relative overflow-hidden border-2 transition-colors hover:border-primary/50 group'>
					<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-xl font-bold flex items-center gap-2'>
							<Trophy className='w-5 h-5 text-primary animate-pulse' />
							Test Natijalari
						</CardTitle>
					</CardHeader>
					<CardContent className='pt-4'>
						<div className='space-y-4'>
							<div className='flex items-center justify-between mb-1'>
								<span className='text-sm font-medium'>
									To&apos;g&apos;ri javoblar
								</span>
								<span className='text-sm font-medium text-primary'>
									{studentData.testResults.correct}%
								</span>
							</div>
							<div className='relative h-4 w-full overflow-hidden rounded-full bg-primary/10'>
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${studentData.testResults.correct}%` }}
									transition={{ duration: 1, ease: 'easeOut' }}
									className='h-full bg-primary rounded-full'
								/>
								<div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse' />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Next Lesson Card */}
			<motion.div variants={item}>
				<Card className='relative overflow-hidden border-2 transition-colors hover:border-primary/50 group'>
					<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
					<CardHeader>
						<CardTitle className='text-xl font-bold flex items-center gap-2'>
							<Clock className='w-5 h-5 text-primary' />
							Keyingi mashg&apos;ulot
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex items-center space-x-4'>
							<div className='p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors'>
								<Clock className='h-6 w-6 text-primary animate-pulse' />
							</div>
							<div className='space-y-1'>
								<p className='font-medium text-lg'>
									{studentData.nextLesson.type} mashg&apos;ulot
								</p>
								<p className='text-muted-foreground'>
									{studentData.nextLesson.date} - {studentData.nextLesson.time}
								</p>
								<p className='text-muted-foreground'>
									Instruktor: {studentData.nextLesson.instructor}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
	ClipboardCheck,
	Timer,
	AlertCircle,
	CheckCircle2,
	ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const testInfo = [
	{
		icon: ClipboardCheck,
		title: '1000 ta test savoli',
		description: "Barcha toifalar bo'yicha test savollari bazasi",
	},
	{
		icon: Timer,
		title: '25 daqiqa',
		description: 'Test topshirish uchun ajratilgan vaqt',
	},
	{
		icon: AlertCircle,
		title: '20 ta savol',
		description: 'Har bir urinishda beriladigan savollar soni',
	},
	{
		icon: CheckCircle2,
		title: "18 to'g'ri javob",
		description: "Test sinovidan o'tish uchun minimal ball",
	},
]

const cars = [
	{
		image:
			'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974&auto=format&fit=crop',
		category: 'B toifa',
	},
	{
		image:
			'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?q=80&w=1974&auto=format&fit=crop',
		category: 'C toifa',
	},
	{
		image:
			'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1974&auto=format&fit=crop',
		category: 'D toifa',
	},
]

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
}

export function Test() {
	return (
		<section className='py-24 bg-muted/30' id='test-sinovi'>
			<div className='container px-4 mx-auto'>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={container}
					className='space-y-16'
				>
					{/* Header */}
					<motion.div
						variants={item}
						className='text-center max-w-3xl mx-auto space-y-4'
					>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
							Test Sinovlari
						</h2>
						<p className='text-lg text-muted-foreground'>
							O&apos;z bilimlaringizni sinab ko&apos;ring va haydovchilik
							guvohnomasini olishga tayyorligingizni tekshiring
						</p>
						<div className='pt-4'>
							<Button
								size='lg'
								className=' text-lg px-8 bg-primary hover:bg-primary/90'
							>
								<Link
									href={'/test'}
									className='flex items-center justify-center '
								>
									Testni boshlash
									<ChevronRight className='ml-2 h-5 w-5' />
								</Link>
							</Button>
						</div>
					</motion.div>

					{/* Test Info Grid */}
					<motion.div
						variants={container}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
					>
						{testInfo.map((info, index) => (
							<motion.div
								key={index}
								variants={item}
								className='p-6 rounded-xl border bg-card hover:bg-card/50 transition-all duration-300'
							>
								<div className='flex items-start space-x-4'>
									<div className='p-3 rounded-lg bg-primary/10'>
										<info.icon className='w-6 h-6 text-primary' />
									</div>
									<div>
										<h3 className='text-lg font-semibold mb-1'>{info.title}</h3>
										<p className='text-sm text-muted-foreground'>
											{info.description}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Car Categories */}
					<motion.div variants={container} className='space-y-8'>
						<motion.h3
							variants={item}
							className='text-2xl font-semibold text-center'
						>
							Mavjud Transport Vositalari Toifalari
						</motion.h3>
						<motion.div
							variants={container}
							className='grid grid-cols-1 md:grid-cols-3 gap-8'
						>
							{cars.map((car, index) => (
								<motion.div
									key={index}
									variants={item}
									className='group relative overflow-hidden rounded-xl'
								>
									<div className='aspect-[16/9] overflow-hidden rounded-xl'>
										<Image
											src={car.image}
											width={300}
											height={200}
											alt={car.category}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										/>
									</div>
									<div className='absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end'>
										<div className='p-6'>
											<h4 className='text-xl font-semibold text-white'>
												{car.category}
											</h4>
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

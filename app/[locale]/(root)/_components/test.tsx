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
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const testInfo = [
	{
		icon: ClipboardCheck,
		title: 'questionsCounttitle',
		description: 'questionsCountdescription',
	},
	{
		icon: Timer,
		title: 'timeLimittitle',
		description: 'timeLimitdescription',
	},
	{
		icon: AlertCircle,
		title: 'questionsPerAttempttitle',
		description: 'questionsPerAttemptdescription',
	},
	{
		icon: CheckCircle2,
		title: 'passingScoretitle',
		description: 'passingScoredescription',
	},
]

const cars = [
	{
		image: '/b.avif',
		category: 'vehicleCategoriescategoriesB',
	},
	{
		image: '/c.avif',
		category: 'vehicleCategoriescategoriesC',
	},
	{
		image: '/d.avif',
		category: 'vehicleCategoriescategoriesD',
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
	const t = useTranslations('TestCommonForPage')
	const pathname = usePathname()
	const currentLang = pathname.split('/')[1]

	// Check if the current path includes a valid language code
	const isValidLang = ['uz', 'uzk', 'ru'].includes(currentLang)
	const testUrl = isValidLang ? `/${currentLang}/test` : '/test'
	return (
		<section
			className='py-14 bg-gradient-to-b from-sky-100/10 via-sky-900/30 to-sky-100/10 dark:from-sky-900/10 dark:via-sky-300/20 dark:to-sky-900/10'
			id='test-sinovi'
		>
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
						className='text-center max-w-4xl mx-auto space-y-4'
					>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
							{t('title')}
						</h2>
						<p className='text-lg text-muted-foreground'>{t('description')}</p>
						<div className='pt-4'>
							<Button
								size='lg'
								className='text-lg px-8 py-3  transition-all duration-300 shadow-lg '
								variant={'custom'}
							>
								<Link
									href={testUrl}
									className='flex items-center justify-center gap-2'
								>
									<span>{t('startTest')}</span>
									<ChevronRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
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
								className='group relative p-6 rounded-xl border bg-white dark:bg-gray-800 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-sm hover:shadow-md'
							>
								{/* Gradient Background on Hover */}
								<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500' />

								<div className='relative flex items-start space-x-4'>
									{/* Icon Container */}
									<div className='p-3 rounded-lg bg-green-500/90 group-hover:bg-green-500/90 transition-colors duration-300'>
										<info.icon className='w-6 h-6 text-primary dark:text-primary-400' />
									</div>

									{/* Text Content */}
									<div>
										<h3 className='text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100'>
											{t(info.title)}
										</h3>
										<p className='text-sm text-muted-foreground dark:text-gray-300'>
											{t(info.description)}
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
							{t('vehicleCategoriestitle')}
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
												{t(car.category)}
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

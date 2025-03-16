'use client'

import { motion } from 'framer-motion'
import { GraduationCap, ClipboardCheck, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const features = [
	{
		icon: GraduationCap,
		title: 'nazariydarslar',
		description: 'nazariydarslartavsif',
		url: '/practice',
	},
	{
		icon: Video,
		title: 'videodarslar',
		description: 'videodarslartavsif',
		url: '/media',
	},
	{
		icon: ClipboardCheck,
		title: 'testtopshirish',
		description: 'testtopshirishtavsif',
		url: '/test',
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

export function Functions() {
	const t = useTranslations('Funksiyalar')
	const pathname = usePathname()

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	return (
		<section
			className='py-14 bg-gradient-to-b from-sky-900/40 to-sky-100/10 dark:from-sky-800/20 dark:to-sky-900/10'
			id='funksiyalar'
		>
			<div className='container px-4 mx-auto'>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={container}
					className='space-y-16'
				>
					<motion.div
						variants={item}
						className='text-center max-w-3xl mx-auto space-y-4'
					>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
							{t('funksiyalarsarlavha')}
						</h2>
						<p className='text-lg text-muted-foreground dark:text-gray-300'>
							{t('funksiyalartavsif')}
						</p>
					</motion.div>

					<motion.div
						variants={container}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
					>
						{features.map((feature, index) => (
							<Link href={`${getLanguagePrefix()}${feature.url}`} key={index}>
								<motion.div
									variants={item}
									whileHover={{ scale: 1.02 }}
									className='group relative h-full'
								>
									<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100' />
									<div className='relative p-6 rounded-xl border bg-card dark:bg-gray-800 hover:bg-card/50 dark:hover:bg-gray-700/50 transition-colors duration-300 h-full flex flex-col'>
										<div className='flex items-center space-x-4 mb-4'>
											<div className='p-3 rounded-lg bg-green-500/80 dark:bg-green-500/90 group-hover:bg-green-500/90 dark:group-hover:bg-green-500/90 transition-colors duration-300'>
												<feature.icon className='w-6 h-6 text-primary dark:text-primary-400' />
											</div>
											<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
												{t(feature.title)}
											</h3>
										</div>
										<p className='text-sm text-muted-foreground dark:text-gray-300 flex-grow'>
											{t(feature.description)}
										</p>
									</div>
								</motion.div>
							</Link>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

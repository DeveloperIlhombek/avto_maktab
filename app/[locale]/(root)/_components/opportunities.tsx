'use client'

import { motion } from 'framer-motion'
import { Car, Users, Award } from 'lucide-react'
import { useTranslations } from 'next-intl'

const features = [
	{
		icon: Car,
		title: 'zamonaviyavtomobillar',
		description: 'zamonaviyavtomobillardescription',
	},
	{
		icon: Users,
		title: 'professionaloqituvchilar',
		description: 'professionaloqituvchilardescription',
	},
	{
		icon: Award,
		title: 'sertifikatlangantalim',
		description: 'sertifikatlangantalimdescription',
	},
]

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

export function Opportunities() {
	const t = useTranslations('Imkoniyatlar')
	return (
		<section className='py-16 bg-gradient-to-b from-sky-100/10 to-sky-900/40 dark:from-sky-900/10 dark:to-sky-800/20'>
			<div className='container px-4 mx-auto'>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={container}
					className='space-y-12'
				>
					<motion.div
						variants={item}
						className='text-center max-w-3xl mx-auto space-y-4'
					>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
							{t('bizningimkoniyatlar')}
						</h2>
						<p className='text-lg text-muted-foreground dark:text-gray-300'>
							{t('imkoniyattalim')}
						</p>
					</motion.div>

					<motion.div
						variants={container}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
					>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								variants={item}
								whileHover={{ scale: 1.05 }}
								className='relative group'
							>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/30 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100' />
								<div className='relative p-8 rounded-lg border bg-card dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
									<div className='mb-4 inline-block p-4 w-fit rounded-lg bg-green-500/70 dark:green-500/70'>
										<feature.icon className='w-6 h-6 text-white dark:text-primary-400' />
									</div>
									<h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>
										{t(feature.title)}
									</h3>
									<p className='text-muted-foreground dark:text-gray-300 flex-grow'>
										{t(feature.description)}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

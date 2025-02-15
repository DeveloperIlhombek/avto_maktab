'use client'

import { motion } from 'framer-motion'
import { Users, Car, Award, Clock } from 'lucide-react'
import { useState } from 'react'

const stats = [
	{
		icon: Users,
		value: '5000+',
		label: "O'quvchilar",
		description: 'Muvaffaqiyatli bitiruvchilar',
	},
	{
		icon: Car,
		value: '50+',
		label: 'Avtomobillar',
		description: "Zamonaviy o'quv mashinalari",
	},
	{
		icon: Award,
		value: '98%',
		label: 'Muvaffaqiyat',
		description: 'Imtihonlarni topshirish darajasi',
	},
	{
		icon: Clock,
		value: '15+',
		label: 'Yillik Tajriba',
		description: "Professional ta'lim",
	},
]

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.2 },
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

export function Statistics() {
	const [isInView, setIsInView] = useState(false)

	return (
		<section className='py-24 bg-primary' id='statistika'>
			<div className='container px-4 mx-auto'>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={container}
					onViewportEnter={() => setIsInView(true)}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							variants={item}
							className='text-center p-8 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10'
						>
							<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6'>
								<stat.icon className='w-8 h-8 text-primary-foreground' />
							</div>
							<motion.h3
								className='text-4xl font-bold text-primary-foreground mb-2'
								initial={{ opacity: 0 }}
								animate={isInView ? { opacity: 1 } : { opacity: 0 }}
								transition={{ duration: 1, delay: index * 0.2 }}
							>
								{stat.value}
							</motion.h3>
							<h4 className='text-xl font-semibold text-primary-foreground mb-2'>
								{stat.label}
							</h4>
							<p className='text-primary-foreground/80'>{stat.description}</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}

'use client'

import { motion } from 'framer-motion'
import { Car, Users, Calendar, Award, Shield, Clock } from 'lucide-react'

const features = [
	{
		icon: Car,
		title: 'Zamonaviy Avtomobillar',
		description:
			"Eng so'nggi rusumdagi xavfsiz va qulay avtomobillar bilan ta'minlaymiz",
	},
	{
		icon: Users,
		title: "Professional O'qituvchilar",
		description: 'Tajribali va sertifikatlangan instruktorlar jamoasi',
	},
	{
		icon: Calendar,
		title: 'Qulay Jadval',
		description: "Sizga mos vaqtda mashg'ulotlarni rejalashtirish imkoniyati",
	},
	{
		icon: Award,
		title: "Sertifikatlangan Ta'lim",
		description: "Davlat tomonidan tasdiqlangan o'quv dasturi va guvohnoma",
	},
	{
		icon: Shield,
		title: 'Xavfsizlik Kafolati',
		description: "Yuqori darajadagi xavfsizlik choralari va sug'urta",
	},
	{
		icon: Clock,
		title: 'Tezkor Natija',
		description: "2 oyda professional haydovchi bo'ling",
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
	return (
		<section className='py-20 bg-muted/50' id='imkoniyatlar'>
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
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
							Bizning Imkoniyatlar
						</h2>
						<p className='text-lg text-muted-foreground'>
							Professional haydovchilik maktabimiz sizga eng yaxshi ta&apos;lim
							va imkoniyatlarni taqdim etadi
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
								<div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100' />
								<div className='relative p-8 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow'>
									<div className='mb-6 inline-block p-4 rounded-lg bg-primary/10'>
										<feature.icon className='w-6 h-6 text-primary' />
									</div>
									<h3 className='text-xl font-semibold mb-2'>
										{feature.title}
									</h3>
									<p className='text-muted-foreground'>{feature.description}</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

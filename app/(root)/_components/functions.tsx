'use client'

import { motion } from 'framer-motion'
import {
	GraduationCap,
	BookOpen,
	ClipboardCheck,
	UserCheck,
	Calendar,
	Trophy,
	FileCheck,
	MessagesSquare,
	Clock,
} from 'lucide-react'

const features = [
	{
		icon: GraduationCap,
		title: 'Nazariy Darslar',
		description: "Online va offline formatda nazariy bilimlarni o'zlashtirish",
	},
	{
		icon: BookOpen,
		title: 'Video Darslar',
		description: '24/7 video darslardan foydalanish imkoniyati',
	},
	{
		icon: ClipboardCheck,
		title: 'Test Topshirish',
		description: 'Bilimlarni mustahkamlash uchun onlayn testlar',
	},
	{
		icon: UserCheck,
		title: 'Instruktor Tanlash',
		description: "O'zingizga mos instruktorni tanlash imkoniyati",
	},
	{
		icon: Calendar,
		title: 'Dars Jadvali',
		description: "Qulay vaqtda amaliy mashg'ulotlarni rejalashtirish",
	},
	{
		icon: Trophy,
		title: 'Progress Kuzatish',
		description: "O'zlashtirish darajangizni monitoring qilish",
	},
	{
		icon: FileCheck,
		title: 'Hujjatlar Tayyorlash',
		description: 'Barcha kerakli hujjatlarni onlayn tayyorlash',
	},
	{
		icon: MessagesSquare,
		title: 'Online Konsultatsiya',
		description: '24/7 onlayn maslahat va yordam olish',
	},
	{
		icon: Clock,
		title: 'Vaqt Tejash',
		description: "Elektron tizim orqali tez va oson ro'yxatdan o'tish",
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
	return (
		<section
			className='py-24 bg-gradient-to-b from-background to-muted'
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
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
							E-AVTOMAKTAB Funksiyalari
						</h2>
						<p className='text-lg text-muted-foreground'>
							Zamonaviy texnologiyalar yordamida haydovchilik guvohnomasini
							olish jarayonini oson va qulay tarzda tashkil etamiz
						</p>
					</motion.div>

					<motion.div
						variants={container}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
					>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								variants={item}
								whileHover={{ scale: 1.02 }}
								className='group relative'
							>
								<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100' />
								<div className='relative p-6 rounded-xl border bg-card hover:bg-card/50 transition-colors duration-300'>
									<div className='flex items-center space-x-4'>
										<div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300'>
											<feature.icon className='w-6 h-6 text-primary' />
										</div>
										<div>
											<h3 className='text-lg font-semibold mb-1'>
												{feature.title}
											</h3>
											<p className='text-sm text-muted-foreground'>
												{feature.description}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

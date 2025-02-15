'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const contactInfo = [
	{
		icon: Phone,
		title: 'Telefon',
		details: ['+998 90 123 45 67', '+998 99 876 54 32'],
	},
	{
		icon: Mail,
		title: 'Email',
		details: ['info@e-avtomaktab.uz', 'support@e-avtomaktab.uz'],
	},
	{
		icon: MapPin,
		title: 'Manzil',
		details: ['Toshkent shahri,', 'Chilonzor tumani, 15-mavze'],
	},
	{
		icon: Clock,
		title: 'Ish Vaqti',
		details: ['Dushanba - Shanba', '09:00 - 18:00'],
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

export function Contact() {
	return (
		<section className='py-24 bg-muted/30' id='boglanish'>
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
							Biz bilan bog&apos;laning
						</h2>
						<p className='text-lg text-muted-foreground'>
							Savol va takliflaringiz bo&apos;lsa, biz bilan bog&apos;laning.
							Mutaxassislarimiz sizga yordam berishdan mamnun.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
						<motion.div
							variants={item}
							className='lg:col-span-2 p-8 rounded-xl border bg-card'
						>
							<form className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div className='space-y-2'>
										<Input placeholder='Ismingiz' className='bg-background' />
									</div>
									<div className='space-y-2'>
										<Input
											placeholder='Telefon raqamingiz'
											className='bg-background'
										/>
									</div>
								</div>
								<div className='space-y-2'>
									<Input
										placeholder='Email manzilingiz'
										type='email'
										className='bg-background'
									/>
								</div>
								<div className='space-y-2'>
									<Textarea
										placeholder='Xabaringiz'
										className='min-h-[150px] bg-background'
									/>
								</div>
								<Button className='w-full md:w-auto'>
									<Send className='w-4 h-4 mr-2' />
									Xabar yuborish
								</Button>
							</form>
						</motion.div>

						<motion.div variants={item} className='space-y-6'>
							{contactInfo.map((info, index) => (
								<div
									key={index}
									className='p-6 rounded-xl border bg-card hover:bg-card/50 transition-colors duration-300'
								>
									<div className='flex items-center space-x-4'>
										<div className='p-3 rounded-lg bg-primary/10'>
											<info.icon className='w-6 h-6 text-primary' />
										</div>
										<div>
											<h3 className='text-lg font-semibold mb-1'>
												{info.title}
											</h3>
											{info.details.map((detail, idx) => (
												<p key={idx} className='text-sm text-muted-foreground'>
													{detail}
												</p>
											))}
										</div>
									</div>
								</div>
							))}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

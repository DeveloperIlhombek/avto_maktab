'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
//import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { CreditCard, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

// Mock payment data
const paymentData = {
	totalAmount: 3000000,
	paidAmount: 2000000,
	remainingAmount: 1000000,
	nextPaymentDate: '2024-03-25',
	paymentHistory: [
		{
			id: 1,
			date: '2024-02-15',
			amount: 1000000,
			type: 'Naqd',
			status: "To'langan",
		},
		{
			id: 2,
			date: '2024-02-01',
			amount: 1000000,
			type: 'Plastik karta',
			status: "To'langan",
		},
	],
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

// const formatCurrency = (amount: number) => {
// 	return new Intl.NumberFormat('uz-UZ', {
// 		style: 'currency',
// 		currency: 'UZS',
// 		minimumFractionDigits: 0,
// 		maximumFractionDigits: 0,
// 	}).format(amount)
// }

export default function PaymentsPage() {
	const progress = (paymentData.paidAmount / paymentData.totalAmount) * 100

	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='space-y-8'
		>
			<div>
				<h2 className='text-3xl font-bold tracking-tight'>To&apos;lovlar</h2>
				<p className='text-muted-foreground'>
					To&apos;lovlar tarixi va joriy holat
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<motion.div variants={item}>
					<Card className='relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-500/40 to-green-500/10 opacity-50' />
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-md font-medium'>
								Umumiy to&apos;lov
							</CardTitle>
							<CreditCard className='h-4 w-4 ' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{paymentData.totalAmount}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={item}>
					<Card className='relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r  from-green-500/10 via-green-500/40 to-green-500/10 opacity-50' />
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-md font-medium'>
								To&apos;langan
							</CardTitle>
							<CheckCircle2 className='h-4 w-4 ' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{paymentData.paidAmount}</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={item}>
					<Card className='relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r  from-red-500/10 via-red-500/40 to-red-500/10 opacity-50' />
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-md font-medium'>
								Qolgan summa
							</CardTitle>
							<AlertCircle className='h-4 w-4 ' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{paymentData.remainingAmount}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={item}>
					<Card className='relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r  from-green-500/10 via-green-500/40 to-green-500/10 opacity-50' />
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-md font-medium'>
								Keyingi to&apos;lov
							</CardTitle>
							<Calendar className='h-4 w-4 ' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{paymentData.nextPaymentDate}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<motion.div variants={item}>
				<Card>
					<CardHeader>
						<CardTitle>To&apos;lovlar progress</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div className='space-y-1'>
									<p className='text-sm font-medium'>Umumiy progress</p>
									<p className='text-sm text-muted-foreground'>
										{progress.toFixed(0)}% to&apos;langan
									</p>
								</div>
								<div className='font-bold'>
									{paymentData.paidAmount} / {paymentData.totalAmount}
								</div>
							</div>
							<div className='h-4 w-full overflow-hidden rounded-full bg-sky-50'>
								<motion.div
									className='h-full bg-green-600'
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 1, ease: 'easeOut' }}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={item}>
				<Card>
					<CardHeader>
						<CardTitle>To&apos;lovlar tarixi</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Sana</TableHead>
									<TableHead>Summa</TableHead>
									<TableHead>To&apos;lov turi</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paymentData.paymentHistory.map(payment => (
									<TableRow key={payment.id}>
										<TableCell>{payment.date}</TableCell>
										<TableCell className='font-medium'>
											{payment.amount}
										</TableCell>
										<TableCell>{payment.type}</TableCell>
										<TableCell>
											<Badge
												variant={
													payment.status === "to'langan"
														? 'destructive'
														: 'secondary'
												}
											>
												{payment.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, ClipboardCheck } from 'lucide-react'
import { RecentStudents } from '../_components/recent-students'

const stats = [
	{
		title: "Jami O'quvchilar",
		value: '2,350',
		icon: Users,
		description: "Faol o'quvchilar soni",
		trend: '+12.5%',
		trendUp: true,
	},
	{
		title: 'Bitiruvchilar',
		value: '1,205',
		icon: GraduationCap,
		description: 'Guvohnoma olganlar',
		trend: '+8.2%',
		trendUp: true,
	},
	{
		title: 'Test Natijalari',
		value: '85%',
		icon: ClipboardCheck,
		description: "O'rtacha ko'rsatkich",
		trend: '+5.1%',
		trendUp: true,
	},
]

export default function AdminDashboard() {
	return (
		<div className='space-y-8'>
			<div>
				<h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
				<p className='text-muted-foreground'>
					Avtomaktab statistikasi va umumiy ma&apos;lumotlar
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{stat.title}
							</CardTitle>
							<stat.icon className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{stat.value}</div>
							<div className='flex items-center space-x-2'>
								<span
									className={`text-sm ${
										stat.trendUp ? 'text-green-500' : 'text-red-500'
									}`}
								>
									{stat.trend}
								</span>
								<span className='text-sm text-muted-foreground'>
									{stat.description}
								</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid gap-4 md:grid-cols-1 lg:grid-cols-7'>
				<Card className='col-span-7'>
					<CardHeader>
						<CardTitle>So&apos;nggi O&apos;quvchilar</CardTitle>
					</CardHeader>
					<CardContent>
						<RecentStudents />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus } from 'lucide-react'

const students = [
	{
		id: 1,
		name: 'Aziz Rahimov',
		phone: '+998 90 123 45 67',
		registrationDate: '2024-02-15',
		category: 'BC',
		status: 'Faol',
	},
	{
		id: 2,
		name: 'Malika Karimova',
		phone: '+998 90 987 65 43',
		registrationDate: '2024-02-10',
		category: 'B',
		status: 'bitirgan',
	},
	{
		id: 3,
		name: 'Jamshid Aliyev',
		phone: '+998 99 555 44 33',
		registrationDate: '2024-02-05',
		category: 'C',
		status: "to'xtatilgan",
	},
]

export default function StudentsPage() {
	const [searchTerm, setSearchTerm] = useState('')

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'faol':
				return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
			case 'bitirgan':
				return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
			case "to'xtatilgan":
				return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
			default:
				return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						O&apos;quvchilar
					</h2>
					<p className='text-muted-foreground'>
						Barcha o&apos;quvchilar ro&apos;yxati va ma&apos;lumotlari
					</p>
				</div>

				<Link href={'/admin/students/create-student'}>
					<Plus className='h-4 w-4' />
					Yangi o&apos;quvchi
				</Link>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder="O'quvchi qidirish..."
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>O&apos;quvchilar ro&apos;yxati</CardTitle>
					<CardDescription>
						Jami {students.length} ta o&apos;quvchi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>O&apos;quvchi</TableHead>
								<TableHead>Ro&apos;yxatdan o&apos;tgan sana</TableHead>
								<TableHead>Toifa</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{students.map(student => (
								<TableRow
									key={student.id}
									className='cursor-pointer hover:bg-muted/50'
								>
									<TableCell>
										<Link
											href={`/admin/students/${student.id}`}
											className='flex items-center gap-3'
										>
											<Avatar className='h-9 w-9'>
												<AvatarFallback>
													{student.name
														.split(' ')
														.map(n => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className='font-medium'>{student.name}</div>
												<div className='text-sm text-muted-foreground'>
													{student.phone}
												</div>
											</div>
										</Link>
									</TableCell>
									<TableCell>{student.registrationDate}</TableCell>
									<TableCell>
										<Badge variant='secondary'>{student.category}</Badge>
									</TableCell>

									<TableCell>
										<Badge className={getStatusColor(student.status)}>
											{student.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

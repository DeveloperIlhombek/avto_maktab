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
import { usePathname } from 'next/navigation'

interface User {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: string
}

interface UserResponse {
	isSuccess: boolean
	result: {
		items: User[]
		pageNumber: number
		pageSize: number
		totalCount: number
		totalPages: number
	}
	statusCode: number
	errorMessages: string[]
}

interface Props {
	data: UserResponse
}

export default function AllUser({ data }: Props) {
	const [searchTerm, setSearchTerm] = useState('')
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}
	const filteredUsers = data.result.items.filter(
		user =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.phone.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const getRoleBadgeColor = (role: string) => {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
			case 'teacher':
				return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
			case 'student':
				return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
			default:
				return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						Foydalanuvchilar
					</h2>
					<p className='text-muted-foreground'>
						Barcha foydalanuvchilar ro&apos;yxati va ma&apos;lumotlari
					</p>
				</div>

				<Link
					href={`${getLanguagePrefix()}/admin/students/create-student`}
					className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
				>
					<Plus className='h-4 w-4' />
					Yangi foydalanuvchi
				</Link>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Foydalanuvchi qidirish...'
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Foydalanuvchilar ro&apos;yxati</CardTitle>
					<CardDescription>
						Jami {data.result.totalCount} ta foydalanuvchi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Foydalanuvchi</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Telefon</TableHead>
								<TableHead>Role</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map(user => (
								<TableRow
									key={user.id}
									className='cursor-pointer hover:bg-muted/50'
								>
									<TableCell>
										<Link
											href={`${getLanguagePrefix()}/admin/students/${user.id}`}
											className='flex items-center gap-3'
										>
											<Avatar className='h-9 w-9'>
												<AvatarFallback>
													{user.name[0]}
													{user.surname[0]}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className='font-medium'>
													{user.name} {user.surname}
												</div>
												<div className='text-sm text-muted-foreground'>
													@{user.username}
												</div>
											</div>
										</Link>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.phone}</TableCell>
									<TableCell>
										<Badge className={getRoleBadgeColor(user.role)}>
											{user.role}
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

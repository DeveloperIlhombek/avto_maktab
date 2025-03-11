'use client'

import { useState, useEffect } from 'react'
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
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Search, Plus, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllUser } from '@/lib/api'

interface User {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
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
	initialData: UserResponse
}

export default function AllUser({ initialData }: Props) {
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(0)
	const [data, setData] = useState(initialData)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	useEffect(() => {
		if (currentPage === 0) return

		const fetchUsers = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getAllUser({
					pageSize: 20,
					pageNumber: currentPage,
				})
				if (response) {
					setData(response)
				} else {
					setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
				}
			} catch (error) {
				setError(`Ma\'lumotlarni yuklashda xatolik yuz berdi ${error}`)
			} finally {
				setLoading(false)
			}
		}

		fetchUsers()
	}, [currentPage])

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

	const getRoleBadgeColor = (role: number) => {
		switch (role) {
			case 1:
				return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
			case 2:
				return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
			case 3:
				return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
			default:
				return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
		}
	}

	const setRole = (role: number) => {
		switch (role) {
			case 1:
				return 'Admin'
			case 2:
				return 'Instructor'
			default:
				return 'Student'
		}
	}

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex justify-between items-center'
			>
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
					className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
				>
					<Plus className='h-4 w-4' />
					Yangi foydalanuvchi
				</Link>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
				className='flex items-center justify-between gap-4'
			>
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
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.2 }}
			>
				<Card>
					<CardHeader>
						<CardTitle>Foydalanuvchilar ro&apos;yxati</CardTitle>
						<CardDescription>
							Jami {data.result.totalCount} ta foydalanuvchi
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						{error ? (
							<div className='text-center text-red-500 py-4'>{error}</div>
						) : (
							<>
								<div className='rounded-md border'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Foydalanuvchi</TableHead>
												<TableHead className='hidden md:table-cell'>
													Email
												</TableHead>
												<TableHead className='hidden sm:table-cell'>
													Telefon
												</TableHead>
												<TableHead>Role</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<AnimatePresence mode='wait'>
												{loading ? (
													<TableRow>
														<TableCell colSpan={4} className='text-center py-8'>
															<div className='flex justify-center items-center gap-2'>
																<Loader2 className='h-4 w-4 animate-spin' />
																<span>Yuklanmoqda...</span>
															</div>
														</TableCell>
													</TableRow>
												) : (
													filteredUsers.map((user, index) => (
														<motion.tr
															key={user.id}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -20 }}
															transition={{ delay: index * 0.05 }}
															className='cursor-pointer hover:bg-muted/50'
														>
															<TableCell>
																<Link
																	href={`${getLanguagePrefix()}/admin/students/${
																		user.id
																	}`}
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
																			{user.username}
																		</div>
																	</div>
																</Link>
															</TableCell>
															<TableCell className='hidden md:table-cell'>
																{user.email}
															</TableCell>
															<TableCell className='hidden sm:table-cell'>
																{user.phone}
															</TableCell>
															<TableCell>
																<Badge className={getRoleBadgeColor(user.role)}>
																	{setRole(user.role)}
																</Badge>
															</TableCell>
														</motion.tr>
													))
												)}
											</AnimatePresence>
										</TableBody>
									</Table>
								</div>

								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href='#'
												onClick={() =>
													setCurrentPage(prev => Math.max(1, prev - 1))
												}
												className={
													currentPage === 0
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>

										{[...Array(data.result.totalPages)].map((_, index) => {
											if (
												index === 0 ||
												index === data.result.totalPages - 1 ||
												(index >= currentPage - 1 && index <= currentPage + 1)
											) {
												return (
													<PaginationItem key={index}>
														<PaginationLink
															href='#'
															onClick={() => setCurrentPage(index)}
															isActive={currentPage === index}
														>
															{index + 1}
														</PaginationLink>
													</PaginationItem>
												)
											}
											if (index === 1 || index === data.result.totalPages - 2) {
												return (
													<PaginationItem key={index}>
														<PaginationEllipsis />
													</PaginationItem>
												)
											}
											return null
										})}

										<PaginationItem>
											<PaginationNext
												href='#'
												onClick={() =>
													setCurrentPage(prev =>
														Math.min(data.result.totalPages, prev + 1)
													)
												}
												className={
													currentPage === data.result.totalPages - 1
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

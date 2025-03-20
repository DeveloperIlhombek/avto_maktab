'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
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
import { motion, AnimatePresence } from 'framer-motion'
import { getAllStudent } from '@/lib/users'
import { useTranslations } from 'next-intl'

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
	items: User[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
}

export default function UsersPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<UserResponse | null>(null)
	const [error, setError] = useState<string | null>(null)
	const currentPage = Number(searchParams.get('page')) || 1
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'
	const t = useTranslations('StudentAdmin')
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true)
				// Convert to 0-based page number for API call
				const response = await getAllStudent({
					pageSize: 10,
					pageNumber: currentPage - 1, // Subtract 1 for API call
				})

				if (response) {
					// Adjust page numbers in response to be 1-based
					setData({
						...response,
						pageNumber: response.pageNumber + 1,
					})
				}
			} catch (err) {
				setError(`Ma'lumotlarni yuklashda xatolik yuz berdi ${err}`)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [currentPage])

	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}

	const createQueryString = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		return params.toString()
	}

	const handlePageChange = (page: number) => {
		router.push(`${pathname}?${createQueryString(page)}`)
	}

	const filteredUsers =
		data?.items.filter(
			user =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.phone.toLowerCase().includes(searchTerm.toLowerCase())
		) || []

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-[50vh]'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-destructive mb-2'>
						Xatolik yuz berdi
					</h2>
					<p className='text-muted-foreground'>{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
			>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						{t('foydalanuvchilar')}
					</h2>
					<p className='text-muted-foreground'>
						{t('barchafoydalanuvchilarroyxativamalumotlari')}
					</p>
				</div>

				<Link
					href={`${getLanguagePrefix()}/admin/students/create-student`}
					className='flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
				>
					<Plus className='h-4 w-4' />
					<span> {t('yangifoydalanuvchi')}</span>
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
							placeholder={t('foydalanuvchilarqidirish')}
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
						<CardTitle> {t('oquvchilarroyxati')}</CardTitle>
						<CardDescription>
							{t('jami')} {data?.totalCount || 0} {t('tafoydalanuvchi')}
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead> {t('oquvchi')}</TableHead>

										<TableHead className='hidden sm:table-cell'>
											{t('telefon')}
										</TableHead>
										<TableHead> {t('role')}</TableHead>
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

													<TableCell className='hidden sm:table-cell'>
														{user.phone}
													</TableCell>
													<TableCell>
														<Badge className='bg-green-500/10 text-green-500 hover:bg-green-500/20'>
															Student
														</Badge>
													</TableCell>
												</motion.tr>
											))
										)}
									</AnimatePresence>
								</TableBody>
							</Table>
						</div>

						{data && (
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											href={`${pathname}?${createQueryString(currentPage - 1)}`}
											onClick={e => {
												e.preventDefault()
												if (currentPage > 1) {
													handlePageChange(currentPage - 1)
												}
											}}
											className={
												currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
											}
										/>
									</PaginationItem>

									{[...Array(data.totalPages)].map((_, index) => {
										const pageNumber = index + 1
										if (
											pageNumber === 1 ||
											pageNumber === data.totalPages ||
											(pageNumber >= currentPage - 1 &&
												pageNumber <= currentPage + 1)
										) {
											return (
												<PaginationItem key={index}>
													<PaginationLink
														href={`${pathname}?${createQueryString(
															pageNumber
														)}`}
														onClick={e => {
															e.preventDefault()
															handlePageChange(pageNumber)
														}}
														isActive={currentPage === pageNumber}
													>
														{pageNumber}
													</PaginationLink>
												</PaginationItem>
											)
										}
										if (
											pageNumber === 2 ||
											pageNumber === data.totalPages - 1
										) {
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
											href={`${pathname}?${createQueryString(currentPage + 1)}`}
											onClick={e => {
												e.preventDefault()
												if (currentPage < data.totalPages) {
													handlePageChange(currentPage + 1)
												}
											}}
											className={
												currentPage >= data.totalPages
													? 'pointer-events-none opacity-50'
													: ''
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

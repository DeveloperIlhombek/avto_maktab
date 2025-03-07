'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { getGroups, createGroup, updateGroup, deleteGroup } from '@/lib/groups'
import type { GroupItem } from '@/lib/groups'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { getAllInstructor, UserData } from '@/lib/users'

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Guruh nomi kamida 1 ta belgidan iborat bo'lishi kerak",
	}),
	description: z.string().min(5, {
		message: "Izoh kamida 5 ta belgidan iborat bo'lishi kerak",
	}),
	instructorId: z.string().min(1, {
		message: "O'qituvchini tanlang",
	}),
})

export default function GroupsPage() {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [groups, setGroups] = useState<GroupItem[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null)
	const [instructor, setInstructor] = useState<UserData[]>([])
	const pageSize = 10

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			instructorId: '',
		},
	})
	const pathname = usePathname()
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	useEffect(() => {
		fetchGroups()
		fetchinstructors()
	}, [currentPage])

	const fetchGroups = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await getGroups({
				pageSize,
				pageNumber: currentPage,
				isActive: true,
				isDeleted: false,
			})

			if (data.isSuccess) {
				setGroups(data.result.items)
				setTotalPages(data.result.totalPages)
				setTotalCount(data.result.totalCount)
			} else {
				setError(data.errorMessages?.join(', ') || 'Failed to fetch groups')
			}
		} catch (error) {
			setError('Failed to fetch groups')
			console.error('Error fetching groups:', error)
		} finally {
			setLoading(false)
		}
	}

	const fetchinstructors = async () => {
		try {
			const intructorresponse = await getAllInstructor({
				pageNumber: 0,
				pageSize: 1000,
			})
			const intructoritems = intructorresponse.items
			setInstructor(intructoritems)
			console.log(instructor)
		} catch (error) {
			toast.error(`Instructorlarni olishda  xatolik yuz berdi ${error}`)
		}
	}

	//Successfully create function
	const handleCreateGroup = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await createGroup(values)
			if (response.isSuccess) {
				toast.success('Guruh muvaffaqiyatli yaratildi')
				setIsCreateDialogOpen(false)
				form.reset()
				fetchGroups()
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			toast.error(`Guruh yaratishda xatolik yuz berdi${error}`)
		}
	}

	const handleEditGroup = async (values: z.infer<typeof formSchema>) => {
		if (!selectedGroup) return

		try {
			const response = await updateGroup(selectedGroup.id, values)
			if (response.isSuccess) {
				toast.success('Guruh muvaffaqiyatli yangilandi')
				setIsEditDialogOpen(false)
				setSelectedGroup(null)
				form.reset()
				fetchGroups()
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			toast.error(`Guruhni yangilashda xatolik yuz berdi ${error}`)
		}
	}

	const handleDeleteGroup = async (id: string) => {
		try {
			const response = await deleteGroup(id)
			if (response.isSuccess) {
				toast.success("Guruh muvaffaqiyatli o'chirildi")
				fetchGroups()
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			toast.error(`Guruhni o'chirishda xatolik yuz berdi ${error}`)
		}
	}

	const handleRowClick = (groupId: string) => {
		router.push(`${getLanguagePrefix()}/admin/groups/${groupId}`)
	}

	const filteredGroups = groups.filter(group =>
		group.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const filterInstructor = instructor.filter(ins =>
		groups.map(group => group.instructorId === ins.id)
	)

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Guruhlar</h2>
					<p className='text-muted-foreground'>
						Barcha guruhlar ro&apos;yxati va boshqaruvi
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button className='gap-2'>
							<Plus className='h-4 w-4' />
							Yangi guruh
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Yangi guruh qo&apos;shish</DialogTitle>
							<DialogDescription>
								Guruhning asosiy ma&apos;lumotlarini kiriting
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleCreateGroup)}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Guruh nomi</FormLabel>
											<FormControl>
												<Input placeholder='Guruh nomini kiriting' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Izoh</FormLabel>
											<FormControl>
												<Input
													placeholder='Guruh haqida izoh kiriting'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='instructorId'
									render={({ field }) => (
										<FormItem>
											<FormLabel>O&apos;qituvchi</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="O'qituvchini tanlang" />
													</SelectTrigger>
													<SelectContent>
														{instructor.map(ins => (
															<SelectItem key={ins.id} value={ins.id}>
																{ins.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button type='submit'>Saqlash</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Guruh qidirish...'
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Guruhlar ro&apos;yxati</CardTitle>
					<CardDescription>Jami {totalCount} ta guruh</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center items-center py-8'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
						</div>
					) : error ? (
						<div className='text-center text-destructive py-8'>{error}</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Guruh nomi</TableHead>
										<TableHead>Izoh</TableHead>
										<TableHead>O&apos;qituvchi</TableHead>
										<TableHead>Yaratilgan sana</TableHead>
										<TableHead className='text-right'>Amallar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredGroups.map(group => (
										<TableRow
											key={group.id}
											className='cursor-pointer hover:bg-muted/50'
											onClick={() => handleRowClick(group.id)}
										>
											<TableCell className='font-medium'>
												{group.name}
											</TableCell>
											<TableCell>{group.description}</TableCell>
											<TableCell>
												{filterInstructor
													.filter(ins => ins.id === group.instructorId)
													.map(ins => ins.name)
													.join(', ')}
											</TableCell>
											<TableCell>
												{new Date(group.createdDate).toLocaleDateString()}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-2'>
													<Dialog
														open={
															isEditDialogOpen && selectedGroup?.id === group.id
														}
														onOpenChange={open => {
															setIsEditDialogOpen(open)
															if (!open) setSelectedGroup(null)
														}}
													>
														<DialogTrigger asChild>
															<Button
																variant='ghost'
																size='icon'
																className='h-8 w-8'
																onClick={e => {
																	e.stopPropagation()
																	setSelectedGroup(group)
																	form.setValue('name', group.name)
																	form.setValue(
																		'description',
																		group.description
																	)
																	form.setValue(
																		'instructorId',
																		group.instructorId
																	)
																}}
															>
																<Pencil className='h-4 w-4' />
															</Button>
														</DialogTrigger>
														<DialogContent onClick={e => e.stopPropagation()}>
															<DialogHeader>
																<DialogTitle>Guruhni tahrirlash</DialogTitle>
																<DialogDescription>
																	Guruh ma&apos;lumotlarini tahrirlang
																</DialogDescription>
															</DialogHeader>
															<Form {...form}>
																<form
																	onSubmit={form.handleSubmit(handleEditGroup)}
																	className='space-y-4'
																>
																	<FormField
																		control={form.control}
																		name='name'
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Guruh nomi</FormLabel>
																				<FormControl>
																					<Input
																						placeholder='Guruh nomini kiriting'
																						{...field}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																	<FormField
																		control={form.control}
																		name='description'
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Izoh</FormLabel>
																				<FormControl>
																					<Input
																						placeholder='Guruh haqida izoh kiriting'
																						{...field}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>

																	<FormField
																		control={form.control}
																		name='instructorId'
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>O&apos;qituvchi</FormLabel>
																				<FormControl>
																					<Select
																						onValueChange={field.onChange}
																						value={field.value}
																					>
																						<SelectTrigger>
																							<SelectValue placeholder="O'qituvchini tanlang" />
																						</SelectTrigger>
																						<SelectContent>
																							{instructor.map(ins => (
																								<SelectItem
																									key={ins.id}
																									value={ins.id}
																								>
																									{ins.name}
																								</SelectItem>
																							))}
																						</SelectContent>
																					</Select>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																	<DialogFooter>
																		<Button type='submit'>Saqlash</Button>
																	</DialogFooter>
																</form>
															</Form>
														</DialogContent>
													</Dialog>

													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant='ghost'
																size='icon'
																className='h-8 w-8 text-destructive'
																onClick={e => e.stopPropagation()}
															>
																<Trash2 className='h-4 w-4' />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent
															onClick={e => e.stopPropagation()}
														>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Guruhni o&apos;chirishni tasdiqlang
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Bu amal qaytarib bo&apos;lmaydi. Guruh
																	butunlay o&apos;chiriladi.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>
																	Bekor qilish
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleDeleteGroup(group.id)}
																	className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
																>
																	O&apos;chirish
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<div className='mt-4'>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href='#'
												onClick={() =>
													setCurrentPage(prev => Math.max(0, prev - 1))
												}
												className={
													currentPage === 0
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>

										{[...Array(totalPages)].map((_, index) => {
											if (
												index === 0 ||
												index === totalPages - 1 ||
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
											if (index === 1 || index === totalPages - 2) {
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
														Math.min(totalPages - 1, prev + 1)
													)
												}
												className={
													currentPage === totalPages - 1
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

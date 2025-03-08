'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, ArrowRightIcon, Plus, Trash2Icon } from 'lucide-react'
import { getGroupById } from '@/lib/groups'
import type { GroupItem } from '@/lib/groups'
import {
	addStudentsToGroup,
	deleteStudentsFromGroup,
	getAllGroupStudent,
	getAllStudent,
	getGroupInstructor,
	UserData,
} from '@/lib/users'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

export default function GroupDetails() {
	const router = useRouter()
	const [group, setGroup] = useState<GroupItem | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [instructor, setInstructor] = useState<UserData>() //=====
	const [student, setStudent] = useState<UserData[]>([]) //=====
	const [isOpen, setIsOpen] = useState(false) //=====
	const [selectedStudents, setSelectedStudents] = useState<string[]>([]) //====
	const [allGroupStudent, setAllGroupStudent] = useState<UserData[]>([]) //====
	const [deletedStudent, setDeletedStudent] = useState<string[]>([])
	const pathname = usePathname()
	const id = pathname.split('/')[4]

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	useEffect(() => {
		const fetchGroup = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getGroupById(id)

				if (response.isSuccess) {
					setGroup(response.result)
				} else {
					setError(
						response.errorMessages?.join(', ') ||
							"Guruh ma'lumotlarini yuklashda xatolik"
					)
				}
			} catch (error) {
				console.error('Error fetching group:', error)
				setError("Guruh ma'lumotlarini yuklashda xatolik yuz berdi")
			} finally {
				setLoading(false)
			}
		}

		const fetchGroupInstructor = async () => {
			try {
				const groupInstructor = await getGroupInstructor({ groupId: id })
				const intructoritems = groupInstructor
				setInstructor(intructoritems)
			} catch (error) {
				toast.error(`Instructorlarni olishda  xatolik yuz berdi ${error}`)
			}
		}

		const fetchAllStudent = async () => {
			try {
				const resultStudent = await getAllStudent({
					pageNumber: 0,
					pageSize: 1000,
				})
				setStudent(resultStudent?.items)
			} catch (error) {
				toast.error(`Studentlarni olishda  xatolik yuz berdi ${error}`)
			}
		}

		const fetchGroupStudent = async () => {
			if (id) {
				try {
					const response = await getAllGroupStudent({
						groupId: id,
						pageNumber: 0,
						pageSize: 1000,
					})
					console.log(response)
					setAllGroupStudent(response.items)
				} catch (error) {
					toast.error(`Studentlarni olishda  xatolik yuz berdi ${error}`)
				}
			}
		}

		if (id) {
			fetchGroup()
			fetchAllStudent()
			fetchGroupInstructor()
			fetchGroupStudent()
		}
	}, [id])

	const handleCheckboxChange = (studentId: string) => {
		setSelectedStudents(prev =>
			prev.includes(studentId)
				? prev.filter(id => id !== studentId)
				: [...prev, studentId]
		)
	}
	const handleDeleteCheckboxChange = (studentId: string) => {
		setDeletedStudent(prev =>
			prev.includes(studentId)
				? prev.filter(id => id !== studentId)
				: [...prev, studentId]
		)
	}

	const handleAddStudents = async () => {
		if (group?.id) {
			try {
				const response = await addStudentsToGroup({
					groupId: group.id,
					studentIds: selectedStudents,
				})
				if (response) {
					toast.success('O‘quvchilar guruhga muvaffaqiyatli qo‘shildi')
					setIsOpen(false)
					setSelectedStudents([])
				}
			} catch (error) {
				console.error('O‘quvchilar qo‘shishda xatolik:', error)
				toast.error('O‘quvchilar qo‘shishda xatolik yuz berdi')
			}
		}
	}
	const handleDeleteStudents = async () => {
		if (group?.id && deletedStudent.length > 0) {
			try {
				const response = await deleteStudentsFromGroup({
					groupId: group?.id,
					studentIds: deletedStudent,
				})

				if (response) {
					toast.success('O‘quvchilar guruhdan muvaffaqiyatli o‘chirildi')
					// O'chirilgan studentlarni ro'yxatdan olib tashlash
					setAllGroupStudent(prev =>
						prev.filter(student => !deletedStudent.includes(student.id))
					)
					// Tanlangan studentlarni tozalash
					setDeletedStudent([])
				}
			} catch (error) {
				console.error('O‘quvchilarni o‘chirishda xatolik:', error)
				toast.error('O‘quvchilarni o‘chirishda xatolik yuz berdi')
			}
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='flex flex-col items-center gap-2'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
					<p className='text-muted-foreground'>
						Guruh ma&apos;lumotlari yuklanmoqda...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-destructive'>
						Xatolik yuz berdi
					</h2>
					<p className='text-muted-foreground mt-2'>{error}</p>
					<Button
						variant='outline'
						className='mt-4'
						onClick={() => router.push(`${getLanguagePrefix()}/admin/groups`)}
					>
						Orqaga qaytish
					</Button>
				</div>
			</div>
		)
	}

	if (!group) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold'>Guruh topilmadi</h2>
					<Button
						variant='outline'
						className='mt-4'
						onClick={() => router.push(`${getLanguagePrefix()}/admin/groups`)}
					>
						Orqaga qaytish
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/groups`}>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Guruh ma&apos;lumotlari
					</h2>
				</div>
				<Button onClick={() => setIsOpen(true)} className='gap-2'>
					<Plus className='h-4 w-4' />
					O&apos;quvchi qo&apos;shish
				</Button>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Guruhga o&apos;quvchi qo&apos;shish</DialogTitle>
						</DialogHeader>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tanlash</TableHead>
									<TableHead>Ismi</TableHead>
									<TableHead>Familiyasi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{student.map(item => (
									<TableRow key={item.id}>
										<TableCell>
											<Checkbox
												checked={selectedStudents.includes(item.id)}
												onCheckedChange={() => handleCheckboxChange(item.id)}
											/>
										</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.surname}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<DialogFooter>
							<Button type='submit' onClick={handleAddStudents}>
								Qo&apos;shish
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Asosiy ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Guruh nomi
							</h3>
							<p className='mt-1 text-lg'>{group.name}</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Izoh
							</h3>
							<p className='mt-1 text-lg'>{group.description}</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								O&apos;qituvchi Ismi
							</h3>
							<p className='mt-1 text-lg'>{instructor?.name}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Qo&apos;shimcha ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='space-y-8'>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Yaratilgan sana
							</h3>
							<p className='mt-1 text-lg'>
								{new Date(group.createdDate).toLocaleDateString()}
							</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Holati
							</h3>
							<p className='mt-1 text-lg'>
								{group.isActive ? 'Faol' : 'Faol emas'}
							</p>
						</div>
						{group.deletedDate && (
							<div>
								<h3 className='font-medium text-sm text-muted-foreground'>
									O&apos;chirilgan sana{' '}
								</h3>
								<p className='mt-1 text-lg'>
									{new Date(group.deletedDate).toLocaleDateString()}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Guruh o&apos;quvchilari</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ismi</TableHead>
								<TableHead>Familiyasi</TableHead>
								<TableHead>Batafsil...</TableHead>
								<TableHead className='text-right'>O&apos;chirish</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{allGroupStudent.map(item => (
								<TableRow key={item.id}>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.surname}</TableCell>
									<TableCell className='overflow-hidden hover:-translate-x-1 transition-transform duration-300'>
										<Link
											href={`${getLanguagePrefix()}/admin/students/${item.id}`}
										>
											<ArrowRightIcon className='cursor-pointer' />
										</Link>
									</TableCell>
									<TableCell className='text-right flex items-center justify-center gap-1'>
										<Checkbox
											checked={deletedStudent.includes(item.id)}
											onCheckedChange={() =>
												handleDeleteCheckboxChange(item.id)
											}
										/>
										<Trash2Icon color='red' />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className='text-right'>
					{deletedStudent.length > 0 && (
						<Button
							onClick={handleDeleteStudents}
							variant='destructive'
							className='gap-2 mb-4'
						>
							<Trash2Icon className='h-4 w-4' />
							Tanlangan o‘quvchilarni o‘chirish
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}

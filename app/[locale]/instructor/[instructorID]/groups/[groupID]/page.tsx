'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Link2 } from 'lucide-react'
import { getGroupById } from '@/lib/groups'
import type { GroupItem } from '@/lib/groups'
import { getAllGroupStudent, UserData } from '@/lib/users'

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
	const [allGroupStudent, setAllGroupStudent] = useState<UserData[]>([])
	const pathname = usePathname()
	const id = pathname.split('/')[5]
	const instructorId = pathname.split('/')[3]

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
			fetchGroupStudent()
		}
	}, [id])

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
						onClick={() =>
							router.push(
								`${getLanguagePrefix()}/uz/instructor/${instructorId}/groups`
							)
						}
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
						onClick={() =>
							router.push(
								`${getLanguagePrefix()}/instructor/${instructorId}/groups`
							)
						}
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
					<Link
						href={`${getLanguagePrefix()}/instructor/${instructorId}/groups`}
					>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Guruh ma&apos;lumotlari
					</h2>
				</div>
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
									<TableHead>Test</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{allGroupStudent.map(item => (
									<TableRow key={item.id}>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.surname}</TableCell>
										<TableCell>
											<Link
												href={`${getLanguagePrefix()}/instructor/${instructorId}/groups/${id}/${
													item.id
												}`}
											>
												<Link2 />
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

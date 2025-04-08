'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllTestsAdmin } from '@/lib/test'
import {
	getAllInstructor,
	getAllStudent,
	IUserResult,
	UserData,
} from '@/lib/users'
import { Users, FileQuestion, UserRoundPen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AdminDashboard() {
	const [instructors, setInstructors] = useState<UserData[]>([])
	const [student, setStudent] = useState<UserData[]>([])
	const [totalCount, setTotalCount] = useState(0)
	const t = useTranslations('Admin')

	useEffect(() => {
		const fetchAllInstructor = async () => {
			try {
				const response: IUserResult = await getAllInstructor({
					pageSize: 1000,
					pageNumber: 0,
				})
				setInstructors(response.items)
			} catch (error) {
				console.error(`Maʼlumotlarni yuklashda xatolik yuz berdi.${error}`)
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

		const fetchTests = async () => {
			try {
				const data = await getAllTestsAdmin(0, 10000, 'uz')

				if (data.isSuccess) {
					setTotalCount(data.result.totalCount)
				} else {
					console.log('Failed to fetch tests')
				}
			} catch (error) {
				console.error('Error fetching tests:', error)
			}
		}
		fetchAllInstructor()
		fetchAllStudent()
		fetchTests()
	}, [])
	// <Link href=>chiqish</Link>
	return (
		<div className='space-y-8'>
			<div>
				<h2 className='text-3xl font-bold tracking-tight'>{t('dashboard')}</h2>
				<p className='text-muted-foreground'>{t('driving_school_info')}</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{t('total_students')}
							<Users />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{student.length} {t('unit')}{' '}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{t('total_instructors')}
							<UserRoundPen />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{instructors.length} {t('unit')}{' '}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{t('total_tests')}
							<FileQuestion />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{totalCount} {t('unit_item')}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

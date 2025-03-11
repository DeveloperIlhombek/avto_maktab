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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AdminDashboard() {
	const [instructors, setInstructors] = useState<UserData[]>([])
	const [student, setStudent] = useState<UserData[]>([])
	const [totalCount, setTotalCount] = useState(0)
	useEffect(() => {
		const fetchAllInstructor = async () => {
			try {
				const response: IUserResult = await getAllInstructor({
					pageSize: 1000,
					pageNumber: 0,
				})
				setInstructors(response.items)
			} catch (error) {
				console.log(`Maʼlumotlarni yuklashda xatolik yuz berdi.${error}`)
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

	return (
		<div className='space-y-8'>
			<div>
				<h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
				<p className='text-muted-foreground'>
					Avtomaktab statistikasi va umumiy ma&apos;lumotlar
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Jami o&apos;quvchilar
							<Users />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{student.length} nafar </div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Jami Instructor
							<UserRoundPen />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{instructors.length} nafar{' '}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Jami testlar
							<FileQuestion />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalCount} ta </div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

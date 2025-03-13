'use client'
import { useEffect, useState } from 'react'
import { getAllStudent } from '@/lib/users'
import AllUser from './_components/all-users'
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

export interface Props {
	initialData: UserResponse
}

export default function Page() {
	const [data, setData] = useState<UserResponse | null>()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllStudent({ pageSize: 20, pageNumber: 0 })
				setData(result)
			} catch (err) {
				setError(`Ma\'lumotlarni yuklashda xatolik yuz berdi: ${err}`)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-xl text-gray-600'>Yuklanmoqda...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-gray-800'>
						Xatolik yuz berdi
					</h2>
					<p className='text-gray-600'>{error}</p>
				</div>
			</div>
		)
	}

	return data ? <AllUser initialData={data} /> : null
}

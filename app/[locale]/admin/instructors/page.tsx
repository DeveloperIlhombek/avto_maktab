'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllInstructor, IUserResult, UserData } from '@/lib/users'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Page() {
	const [instructors, setInstructors] = useState<UserData[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const pathname = usePathname()

	// Extract the language prefix from the pathname
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		// Check if the first segment after the initial slash is a language code
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	useEffect(() => {
		const fetchAllInstructor = async () => {
			try {
				const response: IUserResult = await getAllInstructor({
					pageSize: 1000,
					pageNumber: 0,
				})
				setInstructors(response.items)
			} catch (error) {
				setError(`Maʼlumotlarni yuklashda xatolik yuz berdi.${error}`)
			} finally {
				setLoading(false)
			}
		}
		fetchAllInstructor()
	}, [])

	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
				{[...Array(6)].map((_, index) => (
					<Card key={index} className='w-full'>
						<CardHeader>
							<Skeleton className='h-6 w-3/4' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-4 w-1/2' />
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Alert variant='destructive' className='w-1/2'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Xatolik</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
			{instructors.map(item => (
				<Link
					key={item.id}
					href={`${getLanguagePrefix}/admin/instructors/${item.id}`}
				>
					<Card className='hover:shadow-lg transition-shadow duration-200'>
						<CardHeader>
							<CardTitle className='text-xl'>
								{item.name} {item.surname}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600'>{item.phone}</p>
							<p className='text-sm text-gray-500'>{item.email}</p>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	)
}

export default Page

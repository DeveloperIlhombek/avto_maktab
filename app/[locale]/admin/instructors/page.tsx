'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllInstructor, IUserResult, UserData } from '@/lib/users'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, PlusCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'

function Page() {
	const [instructors, setInstructors] = useState<UserData[]>([])
	const [loading, setLoading] = useState(true)
	const [totalInstructor, setTotalInstructor] = useState(0)
	const [error, setError] = useState<string | null>(null)

	const pathname = usePathname()
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
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
				setTotalInstructor(response.items.length)
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
	if (totalInstructor === 0) {
		return (
			<div className='w-full h-full flex justify-center items-center p-4'>
				<Card className='w-full md:w-1/2 lg:w-1/3 h-fit shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800'>
					<CardHeader className='p-6 border-b border-gray-200 dark:border-gray-700'>
						<div className='text-center text-gray-600 dark:text-gray-300 text-sm font-medium'>
							Sizda Instructorlar mavjud emas
						</div>
					</CardHeader>
					<CardContent className='p-6 flex flex-col items-center justify-center gap-6'>
						<Image
							src={'/images (1).png'}
							alt='user'
							width={200}
							height={200}
							className='rounded-full object-cover border-4 border-gray-200 dark:border-gray-700'
						/>
						<Link href={`${getLanguagePrefix()}/admin/instructors/create`}>
							<Button
								variant={'custom'}
								className='w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
							>
								<PlusCircle className='w-5 h-5' />
								Instruktorlar qo&apos;shish
							</Button>
						</Link>
					</CardContent>
				</Card>
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
		<main>
			<div className='flex justify-end gap-4 p-6'>
				<Button variant={'custom'}>
					<Link href={`${getLanguagePrefix()}/admin/instructors/create`}>
						Instructor qo&apos;shish
					</Link>{' '}
				</Button>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
				{instructors.map(item => (
					<motion.div
						key={item.id}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='w-full'
					>
						<Link href={`${getLanguagePrefix()}/admin/instructors/${item.id}`}>
							<Card className='overflow-hidden rounded-xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl bg-white dark:bg-gray-800'>
								<CardHeader className='p-4 flex flex-col items-center'>
									<div className='relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-300 dark:border-green-600'>
										<div className='w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
											<User className='w-12 h-12 text-gray-400 dark:text-gray-500' />
										</div>
									</div>
									<CardTitle className='text-xl font-semibold mt-4 text-gray-800 dark:text-white'>
										{item.name} {item.surname}
									</CardTitle>
								</CardHeader>
								<CardContent className='p-4 text-center'>
									<p className='text-gray-700 dark:text-gray-300 font-medium'>
										{item.phone}
									</p>
									<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
										{item.email}
									</p>
								</CardContent>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>
		</main>
	)
}

export default Page

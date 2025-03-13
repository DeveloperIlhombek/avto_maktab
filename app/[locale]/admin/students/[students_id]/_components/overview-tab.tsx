'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserById } from '@/lib/users'

interface OverviewTabProps {
	userId: string
}

interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}

export function OverviewTab({ userId }: OverviewTabProps) {
	const [userData, setUserData] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getUserById(userId)

				if (response.isSuccess && response.result) {
					setUserData(response.result)
				} else {
					setError(
						response.errorMessages?.join(', ') ||
							"Ma'lumotlarni yuklashda xatolik yuz berdi"
					)
				}
			} catch (error) {
				setError("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi")
				console.error('Error fetching user:', error)
			} finally {
				setLoading(false)
			}
		}

		if (userId) {
			fetchUser()
		}
	}, [userId])

	if (loading) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='grid grid-cols-2 gap-4'>
						{[1, 2, 3, 4].map(i => (
							<div key={i}>
								<div className='h-4 w-24 bg-muted animate-pulse mb-2'></div>
								<div className='h-6 w-32 bg-muted animate-pulse'></div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center text-destructive'>
							<p>{error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!userData) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<p>Foydalanuvchi topilmadi</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader>
					<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
				</CardHeader>
				<CardContent className='grid grid-cols-2 gap-4'>
					<div>
						<p className='text-sm text-muted-foreground'>Ism</p>
						<p className='font-medium'>{userData.name}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Familiya</p>
						<p className='font-medium'>{userData.surname}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Telefon</p>
						<p className='font-medium'>{userData.phone}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Email</p>
						<p className='font-medium'>{userData.email}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Foydalanuvchi nomi</p>
						<p className='font-medium'>{userData.username}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Role</p>
						<p className='font-medium capitalize'>Student</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

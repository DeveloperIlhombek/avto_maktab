'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getUserById } from '@/lib/users'
import { usePathname } from 'next/navigation'

interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}

export function ProfileCard() {
	const [userData, setUserData] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()
	const Id = pathname.split('/')[4]

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getUserById(Id)

				if (response && response.isSuccess) {
					setUserData(response.result)
				} else {
					setError(
						response?.errorMessages?.join(', ') || 'Failed to fetch user data'
					)
				}
			} catch (error) {
				setError('An error occurred while fetching user data')
				console.error('Error fetching user:', error)
			} finally {
				setLoading(false)
			}
		}

		if (Id) {
			fetchUser()
		}
	}, [Id])

	if (loading) {
		return (
			<Card className='md:col-span-1'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center'>
						<div className='h-24 w-24 rounded-full bg-muted animate-pulse mb-4'></div>
						<div className='h-6 w-32 bg-muted animate-pulse mb-2'></div>
						<div className='h-4 w-48 bg-muted animate-pulse mb-4'></div>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className='md:col-span-1'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center text-destructive'>
						<p>Xatolik: {error}</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (!userData) {
		return (
			<Card className='md:col-span-1'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center'>
						<p>User not found</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='md:col-span-1 max-h-80'>
			<CardContent className='pt-6'>
				<div className='flex flex-col items-center text-center'>
					<Avatar className='h-24 w-24 mb-4'>
						<AvatarFallback className='text-2xl bg-green-400 shadow-green-200'>
							{`${userData.name[0]}${userData.surname[0]}`}
						</AvatarFallback>
					</Avatar>
					<h3 className='text-xl font-semibold'>{`${userData.name} ${userData.surname}`}</h3>
					<p className='text-sm text-muted-foreground mb-4'>{userData.email}</p>
					<Badge variant='secondary' className='mb-6 bg-green-400'>
						Student
					</Badge>
					<div className='w-full space-y-2'>
						<div className='flex justify-between text-sm'>
							<span className='text-muted-foreground'>Telefon</span>
							<span className='font-medium'>{userData.phone}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

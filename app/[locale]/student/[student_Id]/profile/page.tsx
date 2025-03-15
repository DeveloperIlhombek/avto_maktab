'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { usePathname } from 'next/navigation'
import { getUserById } from '@/lib/users'
import { Mail, Phone, User, Shield } from 'lucide-react'

//import { useForm } from 'react-hook-form'
//import { zodResolver } from '@hookform/resolvers/zod'

// Parolni o'zgartirish uchun validatsiya sxemasi

// Mock student data

interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}

export default function StudentProfile() {
	const [userData, setUserData] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()
	const Id = pathname.split('/')[3]

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getUserById(Id)

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

		if (Id) {
			fetchUser()
		}
	}, [Id])

	if (loading) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='grid grid-cols-2 gap-4'>
						{[1, 2, 3, 4].map(i => (
							<div key={i} className='space-y-2'>
								<div className='h-4 w-24 bg-muted animate-pulse rounded'></div>
								<div className='h-6 w-32 bg-muted animate-pulse rounded'></div>
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

	const InfoItem = ({
		icon: Icon,
		label,
		value,
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any
		label: string
		value: string
	}) => (
		<div className='flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm'>
			<div className='p-2 rounded-full bg-primary/10'>
				<Icon className='h-5 w-5 text-primary' />
			</div>
			<div>
				<p className='text-sm text-muted-foreground'>{label}</p>
				<p className='font-medium'>{value}</p>
			</div>
		</div>
	)

	return (
		<div className='space-y-6 min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 sm:p-8 w-full'>
			<div>
				<h2 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
					Profil
				</h2>
				<p className='text-muted-foreground'>Shaxsiy ma&apos;lumotlaringiz</p>
			</div>
			<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
				<CardHeader>
					<div className='flex items-center gap-6'>
						<Avatar className='h-24 w-24 ring-2 ring-primary/20 ring-offset-2'>
							<AvatarFallback className='text-3xl bg-primary/10'>
								{userData?.name
									.split(' ')
									.map(n => n[0])
									.join('')
									.toLocaleUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className='text-2xl'>
								{userData?.name} {userData?.surname}
							</CardTitle>

							<Badge variant='secondary' className='mt-2'>
								O&apos;quvchi
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<InfoItem
							icon={User}
							label='Foydalanuvchi nomi'
							value={userData?.username || ''}
						/>
						<InfoItem icon={Mail} label='Email' value={userData?.email || ''} />
						<InfoItem
							icon={Phone}
							label='Telefon'
							value={userData?.phone || ''}
						/>
						<InfoItem
							icon={Shield}
							label='Role'
							value={userData?.role === 1 ? 'Administrator' : 'Foydalanuvchi'}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

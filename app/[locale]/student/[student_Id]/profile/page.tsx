'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { usePathname } from 'next/navigation'
import { getUserById } from '@/lib/api'

// Mock student data
const studentData = {
	id: 'ST123456',
	name: 'Aziz Rahimov',
	email: 'aziz@gmail.com',
	phone: '+998 90 123 45 67',
	address: 'Samarqand shahar Bulungur tumani',
	birthDate: '1995-05-15',
	group: 'B-123',
	category: 'B',
	registrationDate: '2024-02-15',
	instructor: 'Akmal Karimov',
	status: 'Faol',
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
export default function StudentProfile() {
	const [userData, setUserData] = useState<UserData | null>(null)
	const [isEditing, setIsEditing] = useState(false)
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
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Profil</h2>
					<p className='text-muted-foreground'>
						Shaxsiy ma&apos;lumotlaringizni ko&apos;ring va tahrirlang
					</p>
				</div>
				<Button
					onClick={() => setIsEditing(!isEditing)}
					variant={isEditing ? 'destructive' : 'default'}
				>
					{isEditing ? 'Bekor qilish' : 'Tahrirlash'}
				</Button>
			</div>

			<Tabs defaultValue='personal' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='personal'>Shaxsiy ma&apos;lumotlar</TabsTrigger>
					<TabsTrigger value='education'>
						O&apos;quv ma&apos;lumotlari
					</TabsTrigger>
					<TabsTrigger value='security'>Xavfsizlik</TabsTrigger>
				</TabsList>

				<TabsContent value='personal' className='space-y-4'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-4'>
								<Avatar className='h-20 w-20'>
									<AvatarFallback className='text-2xl bg-green-300 shadow-md'>
										{userData?.name
											.split(' ')
											.map(n => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>{}</CardTitle>
									<CardDescription>ID: {userData?.id}</CardDescription>
									<CardDescription>
										Foydalanuvchi: {userData?.name}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Ism</Label>
									<Input
										id='name'
										defaultValue={userData?.name}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='surname'>Familiya</Label>
									<Input
										id='surname'
										defaultValue={userData?.surname}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										defaultValue={userData?.email}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Telefon</Label>
									<Input
										id='phone'
										defaultValue={userData?.phone}
										disabled={!isEditing}
									/>
								</div>
							</div>
							{isEditing && (
								<div className='flex justify-end'>
									<Button>Saqlash</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='education'>
					<Card>
						<CardHeader>
							<CardTitle>O&apos;quv ma&apos;lumotlari</CardTitle>
							<CardDescription>
								O&apos;quv jarayoni bilan bog&apos;liq ma&apos;lumotlar
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-1'>
									<Label>Guruh</Label>
									<p className='font-medium'>{studentData.group}</p>
								</div>
								<div className='space-y-1'>
									<Label>Toifa</Label>
									<p className='font-medium'>{studentData.category}</p>
								</div>
								<div className='space-y-1'>
									<Label>Ro&apos;yxatdan o&apos;tgan sana</Label>
									<p className='font-medium'>
										{new Date(studentData.registrationDate).toLocaleDateString(
											'uz-UZ'
										)}
									</p>
								</div>
								<div className='space-y-1'>
									<Label>Instruktor</Label>
									<p className='font-medium'>{studentData.instructor}</p>
								</div>
								<div className='space-y-1'>
									<Label>Status</Label>
									<Badge variant='secondary'>{studentData.status}</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='security'>
					<Card>
						<CardHeader>
							<CardTitle>Xavfsizlik</CardTitle>
							<CardDescription>Parolingizni o&apos;zgartirish</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='currentPassword'>Joriy parol</Label>
									<Input id='currentPassword' type='password' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>Yangi parol</Label>
									<Input id='newPassword' type='password' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>
										Yangi parolni tasdiqlang
									</Label>
									<Input id='confirmPassword' type='password' />
								</div>
								<Button>Parolni o&apos;zgartirish</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

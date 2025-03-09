'use client'

import { useEffect, useState } from 'react'
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
import {
	Calendar,
	Mail,
	Phone,
	User,
	Shield,
	BookOpen,
	MapPin,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateUserParol } from '@/lib/users'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Parolni o'zgartirish uchun validatsiya sxemasi
const passwordSchema = z
	.object({
		currentPassword: z.string().min(6, {
			message: 'Joriy parol kamida 6 ta belgidan iborat boʻlishi kerak',
		}),
		newPassword: z.string().min(6, {
			message: 'Yangi parol kamida 6 ta belgidan iborat boʻlishi kerak',
		}),
		confirmPassword: z.string().min(6, {
			message: 'Tasdiqlash paroli kamida 6 ta belgidan iborat boʻlishi kerak',
		}),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Yangi parol va tasdiqlash paroli bir xil boʻlishi kerak',
		path: ['confirmPassword'],
	})
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
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()
	const Id = pathname.split('/')[3]
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(passwordSchema),
	})
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

	const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
		try {
			// Parolni yangilash uchun API-ga so'rov yuborish
			if (userData?.id) {
				await updateUserParol(userData.id, {
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
				})
				toast.success('Parol muvaffaqiyatli oʻzgartirildi')
				reset() // Formani tozalash
			} else {
				toast.error('Foydalanuvchi ID topilmadi')
			}
		} catch (error) {
			toast.error('Parolni oʻzgartirishda xatolik yuz berdi')
			console.error('Error updating password:', error)
		}
	}

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

			<Tabs defaultValue='personal' className='space-y-6 w-full'>
				<TabsList className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
					<TabsTrigger value='personal'>Shaxsiy ma&apos;lumotlar</TabsTrigger>
					<TabsTrigger value='education'>
						O&apos;quv ma&apos;lumotlari
					</TabsTrigger>
					<TabsTrigger value='security'>Xavfsizlik</TabsTrigger>
				</TabsList>

				<TabsContent value='personal'>
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
								<InfoItem
									icon={Mail}
									label='Email'
									value={userData?.email || ''}
								/>
								<InfoItem
									icon={Phone}
									label='Telefon'
									value={userData?.phone || ''}
								/>
								<InfoItem
									icon={Shield}
									label='Role'
									value={
										userData?.role === 1 ? 'Administrator' : 'Foydalanuvchi'
									}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='education'>
					<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
						<CardHeader>
							<CardTitle>O&apos;quv ma&apos;lumotlari</CardTitle>
							<CardDescription>
								O&apos;quv jarayoni bilan bog&apos;liq ma&apos;lumotlar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InfoItem
									icon={BookOpen}
									label='Guruh'
									value={studentData.group}
								/>
								<InfoItem
									icon={Shield}
									label='Toifa'
									value={studentData.category}
								/>
								<InfoItem
									icon={Calendar}
									label="Ro'yxatdan o'tgan sana"
									value={new Date(
										studentData.registrationDate
									).toLocaleDateString('uz-UZ')}
								/>
								<InfoItem
									icon={User}
									label='Instruktor'
									value={studentData.instructor}
								/>
								<InfoItem
									icon={MapPin}
									label='Manzil'
									value={studentData.address}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='security'
					className='flex flex-col justify-start items-start w-full gap-4 sm:flex-row'
				>
					<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
						<CardHeader>
							<CardTitle>Xavfsizlik ma&apos;lumotlari</CardTitle>
							<CardDescription>
								Hisobingiz xavfsizligi bilan bog&apos;liq ma&apos;lumotlar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<InfoItem
									icon={Shield}
									label='Oxirgi kirish'
									value={new Date().toLocaleDateString('uz-UZ')}
								/>
							</div>
						</CardContent>
					</Card>
					<Card className='md:w-1/2'>
						<CardHeader>
							<CardTitle>Xavfsizlik</CardTitle>
							<CardDescription>Parolingizni o&apos;zgartirish</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='currentPassword'>Joriy parol</Label>
									<Input
										id='currentPassword'
										type='password'
										{...register('currentPassword')}
									/>
									{errors.currentPassword && (
										<p className='text-sm text-destructive'>
											{errors.currentPassword.message}
										</p>
									)}
								</div>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>Yangi parol</Label>
									<Input
										id='newPassword'
										type='password'
										{...register('newPassword')}
									/>
									{errors.newPassword && (
										<p className='text-sm text-destructive'>
											{errors.newPassword.message}
										</p>
									)}
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>
										Yangi parolni tasdiqlang
									</Label>
									<Input
										id='confirmPassword'
										type='password'
										{...register('confirmPassword')}
									/>
									{errors.confirmPassword && (
										<p className='text-sm text-destructive'>
											{errors.confirmPassword.message}
										</p>
									)}
								</div>
								<Button type='submit'>Parolni o&apos;zgartirish</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

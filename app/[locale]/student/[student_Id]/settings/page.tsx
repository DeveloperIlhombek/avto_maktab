'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { z } from 'zod'
import { toast } from 'sonner'
import { updateUserParol, UserData } from '@/lib/users'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'
import { loginUser, UserDataLogin } from '@/lib/api'

const passwordSchema = z
	.object({
		currentPassword: z.string().min(3, {
			message: 'Joriy parol kamida 3 ta belgidan iborat boʻlishi kerak',
		}),
		newPassword: z.string().min(3, {
			message: 'Yangi parol kamida 3 ta belgidan iborat boʻlishi kerak',
		}),
		confirmPassword: z.string().min(3, {
			message: 'Tasdiqlash paroli kamida 3 ta belgidan iborat boʻlishi kerak',
		}),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Yangi parol va tasdiqlash paroli bir xil boʻlishi kerak',
		path: ['confirmPassword'],
	})

function Settings() {
	const [userData, setUserData] = useState<UserDataLogin | null>(null)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const pathname = usePathname()
	const Id = pathname.split('/')[3]

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await loginUser({ login, password })
				if (response.isSuccess) {
					if (response.result && response.result.user) {
						setUserData({
							id: response.result.user.id,
							username: response.result.user.username,
							role: response.result.user.role,
						})
					}
				}
			} catch (error) {
				console.error('Error fetching user:', error)
			}
		}

		if (Id) {
			fetchUser()
		}
	}, [Id, login, password])

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(passwordSchema),
	})

	const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
		try {
			// Joriy parolni tekshirish
			const checkResponse = await loginUser({
				login,
				password: data.currentPassword,
			})
			if (!checkResponse.isSuccess) {
				toast.error('Joriy parol notoʻgʻri')
				return
			}

			// Yangi parolni yangilash
			if (userData?.id) {
				const updateResponse = await updateUserParol(userData.id, {
					password: data.newPassword,
				})

				if (updateResponse.isSuccess) {
					toast.success('Parol muvaffaqiyatli oʻzgartirildi')
					reset()
				} else {
					toast.error('Parolni oʻzgartirishda xatolik yuz berdi')
				}
			} else {
				toast.error('Foydalanuvchi ID topilmadi')
			}
		} catch (error) {
			toast.error('Parolni oʻzgartirishda xatolik yuz berdi')
			console.error('Error updating password:', error)
		}
	}

	return (
		<div>
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
							<Label htmlFor='confirmPassword'>Yangi parolni tasdiqlang</Label>
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
		</div>
	)
}

export default Settings

'use client'

import React from 'react'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateOwnPassword } from '@/lib/users'

// Parol validatsiyasi uchun schema
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
	const token = localStorage.getItem('token')

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(passwordSchema),
	})

	// Parolni o'zgartirish funksiyasi
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onSubmit = async (data: any) => {
		try {
			if (!token) {
				toast.error('Avval tizimga kiring')
				return
			}

			const response = await UpdateOwnPassword(
				data.currentPassword,
				data.newPassword,
				token
			)
			console.log(response)

			toast.success('Parol muvaffaqiyatli o‘zgartirildi')
			reset()
		} catch (error) {
			toast.error('Parolni yangilashda xatolik yuz berdi')
			console.error(error)
		}
	}

	return (
		<div className='flex justify-center items-center h-screen'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Xavfsizlik</CardTitle>
					<CardDescription>Parolingizni o&apos;zgartirish</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						{/* Joriy parol */}
						<div>
							<Label htmlFor='currentPassword'>Joriy parol</Label>
							<Input
								id='currentPassword'
								type='password'
								{...register('currentPassword')}
							/>
							{errors.currentPassword && (
								<p className='text-sm text-red-500'>
									{errors.currentPassword.message}
								</p>
							)}
						</div>

						{/* Yangi parol */}
						<div>
							<Label htmlFor='newPassword'>Yangi parol</Label>
							<Input
								id='newPassword'
								type='password'
								{...register('newPassword')}
							/>
							{errors.newPassword && (
								<p className='text-sm text-red-500'>
									{errors.newPassword.message}
								</p>
							)}
						</div>

						{/* Yangi parolni tasdiqlash */}
						<div>
							<Label htmlFor='confirmPassword'>Yangi parolni tasdiqlang</Label>
							<Input
								id='confirmPassword'
								type='password'
								{...register('confirmPassword')}
							/>
							{errors.confirmPassword && (
								<p className='text-sm text-red-500'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<Button type='submit' className='w-full'>
							Parolni o&apos;zgartirish
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Settings

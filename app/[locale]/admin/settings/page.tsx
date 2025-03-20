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
import { useTranslations } from 'next-intl'

function Settings() {
	const token = localStorage.getItem('token')
	const t = useTranslations('SettingsValidation')
	// Parol validatsiyasi uchun schema
	const passwordSchema = z
		.object({
			newPassword: z.string().min(3, {
				message: `${t('newParolmorthen3symbol')}`,
			}),
			confirmPassword: z.string().min(3, {
				message: `${t('confirmParolmorthen3symbol')}`,
			}),
		})
		.refine(data => data.newPassword === data.confirmPassword, {
			message: `${t('newParolAndConfirmSame')}`,
			path: ['confirmPassword'],
		})

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(passwordSchema),
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onSubmit = async (data: any) => {
		try {
			if (!token) {
				toast.error(`${t('pleaseLoginFirst')}`)
				return
			}

			await UpdateOwnPassword(data.newPassword, token)

			toast.success('Parol muvaffaqiyatli o‘zgartirildi')
			reset()
		} catch (error) {
			toast.error('Parolni yangilashda xatolik yuz berdi')
			console.error(error)
		}
	}

	return (
		<div className='flex justify-center items-center max-h-screen'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>{t('xavfsizlik')}</CardTitle>
					<CardDescription>{t('parolniozgartirish')}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						{/* Yangi parol */}
						<div>
							<Label htmlFor='newPassword'>{t('yangiparol')}</Label>
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
							<Label htmlFor='confirmPassword'>
								{t('yangiparolnitasdiqlang')}
							</Label>
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
							{t('parolniozgartirish')}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Settings

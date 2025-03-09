'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { createUser } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'

const formSchema = z.object({
	name: z.string().min(3, {
		message: "Ism kamida 3 ta belgidan iborat bo'lishi kerak",
	}),
	surname: z.string().min(3, {
		message: "Familiya kamida 3 ta belgidan iborat bo'lishi kerak",
	}),
	username: z.string().min(3, {
		message: "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak",
	}),
	email: z.string().email({
		message: "Noto'g'ri email format",
	}),
	phone: z.string().min(9, {
		message: "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak",
	}),
	password: z.string().min(6, {
		message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
	}),
	role: z.number({
		required_error: 'Rolni tanlang',
	}),
})

export default function CreateStudent() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			surname: '',
			username: '',
			email: '',
			phone: '',
			password: '',
			role: 3,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true)
			console.log('Submitting values:', values)
			await createUser(values)
			toast.success("O'quvchi muvaffaqiyatli qo'shildi")
			router.push(`${getLanguagePrefix()}/admin/students`)
		} catch (error) {
			toast.error("O'quvchini qo'shishda xatolik yuz berdi")
			console.error('Error creating student:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/students`}>
						<Button variant='custom' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Yangi o&apos;quvchi qo&apos;shish
					</h2>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
							<CardDescription>
								O&apos;quvchining asosiy ma&apos;lumotlarini kiriting
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ism</FormLabel>
											<FormControl>
												<Input placeholder='Ismni kiriting' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='surname'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Familiya</FormLabel>
											<FormControl>
												<Input placeholder='Familiyani kiriting' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='username'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Foydalanuvchi nomi</FormLabel>
											<FormControl>
												<Input
													placeholder='Foydalanuvchi nomini kiriting'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder='Email manzilini kiriting'
													type='email'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Telefon</FormLabel>
											<FormControl>
												<Input placeholder='+998 90 123 45 67' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Parol</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='Parolni kiriting'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='role'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Rol</FormLabel>
											<Select
												onValueChange={value => {
													if (value) {
														field.onChange(Number(value))
													}
												}}
												defaultValue={field.value.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Rolni tanlang' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='1'>Admin</SelectItem>
													<SelectItem value='2'>Instruktor</SelectItem>
													<SelectItem value='3'>student</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-4'>
						<Link href={`${getLanguagePrefix()}/admin/students`}>
							<Button variant='outline'>Bekor qilish</Button>
						</Link>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

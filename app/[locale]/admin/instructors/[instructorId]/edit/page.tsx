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

import { ArrowLeft } from 'lucide-react'
import { updateUser, getUserById, UserResponseById } from '@/lib/users'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

// Forma validatsiya sxemasi
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
	role: z.number({
		required_error: 'Rolni tanlang',
	}),
})

export default function UpdateStudent() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [initialValues, setInitialValues] = useState<z.infer<
		typeof formSchema
	> | null>(null)

	const pathname = usePathname()
	const pathSegment = pathname.split('/')
	const instructorID = pathSegment[4]

	const language =
		pathSegment.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegment[1])
			? (pathSegment[1] as 'uz' | 'uzk' | 'ru')
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
			role: 3,
		},
	})

	// Foydalanuvchi ma'lumotlarini olish
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData: UserResponseById = await getUserById(instructorID)

				setInitialValues(userData.result) // initialValues ni saqlash
				form.reset(userData.result)
			} catch (error) {
				toast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi")
				console.error('Error fetching user data:', error)
			}
		}

		fetchUserData()
	}, [instructorID, form])

	// Formani yuborish (faqat o'zgargan ma'lumotlar bilan)
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true)

			// FormData ni yaratish
			const formData = new FormData()

			// Faqat o'zgargan maydonlarni aniqlash
			const dirtyFields = form.formState.dirtyFields

			// O'zgargan maydonlarni FormData ga qo'shish
			if (dirtyFields.name) formData.append('name', values.name)
			if (dirtyFields.surname) formData.append('surname', values.surname)
			if (dirtyFields.username) formData.append('username', values.username)
			if (dirtyFields.email) formData.append('email', values.email)
			if (dirtyFields.phone) formData.append('phone', values.phone)

			// ID ni har doim qo'shish
			formData.append('id', instructorID)

			// updateUser funksiyasini chaqirish
			await updateUser(instructorID, formData)
			toast.success("Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi")
			router.push(`${getLanguagePrefix()}/admin/instructors`)
		} catch (error) {
			toast.error("Foydalanuvchi ma'lumotlarini yangilashda xatolik yuz berdi")
			console.error('Error updating user:', error)
		} finally {
			setIsLoading(false)
		}
	}

	// Formani qayta tiklash (reset) funksiyasi
	const handleReset = () => {
		if (initialValues) {
			form.reset(initialValues)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/students`}>
						<Button variant='custom' size='icon'>
							<ArrowLeft className='h-4 w-4 font-bold' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Foydalanuvchi ma&apos;lumotlarini yangilash
					</h2>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
							<CardDescription>
								Foydalanuvchining yangilangan ma&apos;lumotlarini kiriting
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
							</div>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-4'>
						<Button type='button' variant='outline' onClick={handleReset}>
							Formani qayta tiklash
						</Button>
						<Link href={`${getLanguagePrefix()}/admin/students`}>
							<Button variant='outline'>Bekor qilish</Button>
						</Link>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? 'Yangilanmoqda...' : 'Yangilash'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

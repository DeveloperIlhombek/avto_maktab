'use client'

import { useRouter } from 'next/navigation'
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

const formSchema = z.object({
	name: z.string().min(3, {
		message: "Ism kamida 3 ta belgidan iborat bo'lishi kerak",
	}),
	email: z.string().email({
		message: "Noto'g'ri email format",
	}),
	phone: z.string().min(9, {
		message: "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak",
	}),
	address: z.string().min(5, {
		message: "Manzil kamida 5 ta belgidan iborat bo'lishi kerak",
	}),
	birthData: z.string(),
	category: z.string({
		required_error: 'Toifani tanlang',
	}),
	instructor: z.string({
		required_error: 'Instruktorni tanlang',
	}),
	totalPayment: z.number().min(0),
	paidAmount: z.number().min(0),
})

const instructors = [
	{ id: '1', name: 'Anvar Qodirov' },
	{ id: '2', name: 'Botir Zokirov' },
	{ id: '3', name: 'Sardor Mahmudov' },
]

export default function CreateStudent() {
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			totalPayment: 0,
			paidAmount: 0,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Add your submission logic here
			console.log(values)
			router.push('/admin/students')
		} catch (error) {
			console.error('Error creating student:', error)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/students'>
						<Button variant='ghost' size='icon'>
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
											<FormLabel>F.I.O</FormLabel>
											<FormControl>
												<Input placeholder="To'liq ismni kiriting" {...field} />
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
									name='birthData'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tug&apos;ilgan sana</FormLabel>
											<FormControl>
												<Input type='date' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='address'
									render={({ field }) => (
										<FormItem className='md:col-span-2'>
											<FormLabel>Manzil</FormLabel>
											<FormControl>
												<Input
													placeholder='Yashash manzilini kiriting'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>O&apos;quv ma&apos;lumotlari</CardTitle>
							<CardDescription>
								O&apos;qish bilan bog&apos;liq ma&apos;lumotlarni kiriting
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='category'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Toifa</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Toifani tanlang' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='A'>A toifa</SelectItem>
													<SelectItem value='B'>B toifa</SelectItem>
													<SelectItem value='C'>C toifa</SelectItem>
													<SelectItem value='D'>D toifa</SelectItem>
													<SelectItem value='BE'>BE toifa</SelectItem>
													<SelectItem value='CE'>CE toifa</SelectItem>
													<SelectItem value='DE'>DE toifa</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='instructor'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Instruktor</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Instruktorni tanlang' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{instructors.map(instructor => (
														<SelectItem
															key={instructor.id}
															value={instructor.id}
														>
															{instructor.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>To&apos;lov ma&apos;lumotlari</CardTitle>
							<CardDescription>
								O&apos;quv kursi uchun to&apos;lov ma&apos;lumotlarini kiriting
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='totalPayment'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Umumiy to&apos;lov</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='0'
													{...field}
													onChange={e => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='paidAmount'
									render={({ field }) => (
										<FormItem>
											<FormLabel>To&apos;langan summa</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='0'
													{...field}
													onChange={e => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-4'>
						<Link href='/admin/students'>
							<Button variant='outline'>Bekor qilish</Button>
						</Link>
						<Button type='submit'>Saqlash</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

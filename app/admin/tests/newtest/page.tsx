'use client'

import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
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
import { ArrowLeft, Plus, X } from 'lucide-react'
import Image from 'next/image'

const formSchema = z.object({
	question: z.string().min(10, {
		message: "Savol matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	description: z.string().min(10, {
		message: "Savol izohi kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	category: z.string({
		required_error: 'Toifani tanlang',
	}),
	choices: z
		.array(
			z.object({
				text: z.string().min(1, 'Javob variantini kiriting'),
				answer: z.boolean().default(false),
			})
		)
		.min(2, 'Kamida 2 ta javob varianti kiriting'),
	media: z
		.object({
			exist: z.boolean().default(false),
			file: z.any().optional(),
		})
		.optional(),
})

export default function NewTest() {
	const router = useRouter()
	const [imagePreview, setImagePreview] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			choices: [
				{ text: '', answer: false },
				{ text: '', answer: false },
			],
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Add your submission logic here
			console.log(values)
			router.push('/admin/tests')
		} catch (error) {
			console.error('Error creating test:', error)
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setImagePreview(reader.result as string)
				form.setValue('media', {
					exist: true,
					file: file,
				})
			}
			reader.readAsDataURL(file)
		}
	}

	const removeImage = () => {
		setImagePreview(null)
		form.setValue('media', {
			exist: false,
			file: undefined,
		})
	}

	const addChoice = () => {
		const currentChoices = form.getValues('choices')
		form.setValue('choices', [...currentChoices, { text: '', answer: false }])
	}

	const removeChoice = (index: number) => {
		const currentChoices = form.getValues('choices')
		if (currentChoices.length > 2) {
			form.setValue(
				'choices',
				currentChoices.filter((_, i) => i !== index)
			)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/tests'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Yangi savol qo&apos;shish
					</h2>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Savol ma&apos;lumotlari</CardTitle>
							<CardDescription>
								Savolning asosiy ma&apos;lumotlarini kiriting
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<FormField
								control={form.control}
								name='question'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Savol matni</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Savolni kiriting'
												className='resize-none'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Savol izohi</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Savol izohini kiriting'
												className='resize-none'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div>
								<FormLabel>Rasm</FormLabel>
								<div className='mt-2'>
									{!imagePreview ? (
										<FormItem>
											<FormLabel className='cursor-pointer'>
												<div className='border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors'>
													<Input
														type='file'
														accept='image/*'
														className='hidden'
														onChange={handleImageChange}
													/>
													<div className='text-sm text-gray-600'>
														Rasmni tanlash uchun bosing yoki bu yerga tashlang
													</div>
												</div>
											</FormLabel>
										</FormItem>
									) : (
										<div className='relative'>
											<Image
												src={imagePreview}
												alt='Preview'
												width={500}
												height={500}
												className='rounded-lg max-h-[300px] w-auto'
											/>
											<Button
												type='button'
												variant='destructive'
												size='icon'
												className='absolute top-2 right-2'
												onClick={removeImage}
											>
												<X className='h-4 w-4' />
											</Button>
										</div>
									)}
								</div>
							</div>

							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<FormLabel>Javob variantlari</FormLabel>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={addChoice}
										className='gap-1'
									>
										<Plus className='h-4 w-4' />
										Variant qo&apos;shish
									</Button>
								</div>

								{form.getValues('choices').map((_, index) => (
									<div key={index} className='flex gap-4'>
										<FormField
											control={form.control}
											name={`choices.${index}.text`}
											render={({ field }) => (
												<FormItem className='flex-1'>
													<FormControl>
														<Input
															placeholder={`${index + 1}-variant`}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`choices.${index}.answer`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className='flex items-center gap-2'>
															<Input
																type='radio'
																name='correctAnswer'
																className='w-4 h-4 text-primary border-gray-300 focus:ring-primary'
																checked={field.value}
																onChange={() => {
																	// Uncheck all other answers
																	const choices = form.getValues('choices')
																	choices.forEach((_, i) => {
																		form.setValue(
																			`choices.${i}.answer`,
																			i === index
																		)
																	})
																}}
															/>
															<span className='text-sm text-gray-600'>
																To&apos;g&apos;ri javob
															</span>
														</div>
													</FormControl>
												</FormItem>
											)}
										/>
										{form.getValues('choices').length > 2 && (
											<Button
												type='button'
												variant='ghost'
												size='icon'
												onClick={() => removeChoice(index)}
											>
												<X className='h-4 w-4' />
											</Button>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-4'>
						<Link href='/admin/tests'>
							<Button variant='outline'>Bekor qilish</Button>
						</Link>
						<Button type='submit'>Saqlash</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

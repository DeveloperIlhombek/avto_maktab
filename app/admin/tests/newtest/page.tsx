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
import { ArrowLeft, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { createTest, uploadImage } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const formSchema = z.object({
	questionUZ: z.string().min(10, {
		message: "Savol matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	questionUZK: z.string().min(10, {
		message: "Savol matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	questionRU: z.string().min(10, {
		message: 'Текст вопроса должен содержать не менее 10 символов',
	}),
	explanationUZ: z.string().min(10, {
		message: "Tushuntirish matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	explanationUZK: z.string().min(10, {
		message: "Tushuntirish matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	explanationRU: z.string().min(10, {
		message: 'Текст объяснения должен содержать не менее 10 символов',
	}),
	choices: z
		.array(
			z.object({
				textUZ: z.string().min(1, 'Javob variantini kiriting'),
				textUZK: z.string().min(1, 'Javob variantini kiriting'),
				textRU: z.string().min(1, 'Введите вариант ответа'),
				isCorrect: z.boolean().default(false),
			})
		)
		.min(2, 'Kamida 2 ta javob varianti kiriting'),
	media: z
		.object({
			exist: z.boolean().default(false),
			file: z.any().nullable(),
		})
		.optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewTest() {
	const router = useRouter()
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			questionUZ: '',
			questionUZK: '',
			questionRU: '',
			explanationUZ: '',
			explanationUZK: '',
			explanationRU: '',
			choices: [
				{ textUZ: '', textUZK: '', textRU: '', isCorrect: false },
				{ textUZ: '', textUZK: '', textRU: '', isCorrect: false },
			],
			media: {
				exist: false,
				file: null,
			},
		},
	})

	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true)

			let mediaUrl = null
			if (values.media?.exist && values.media.file) {
				mediaUrl = await uploadImage(values.media.file)
			}

			const testData = {
				questionUZ: values.questionUZ,
				questionUZK: values.questionUZK,
				questionRU: values.questionRU,
				explanationUZ: values.explanationUZ,
				explanationUZK: values.explanationUZK,
				explanationRU: values.explanationRU,
				mediaUrl,
				answers: values.choices.map(choice => ({
					answerTextUZ: choice.textUZ,
					answerTextUZK: choice.textUZK,
					answerTextRU: choice.textRU,
					isCorrect: choice.isCorrect,
				})),
			}

			const response = await createTest(testData)

			if (response.isSuccess) {
				router.push('/admin/tests')
			} else {
				console.error('Failed to create test:', response.errorMessages)
			}
		} catch (error) {
			console.error('Error creating test:', error)
		} finally {
			setIsSubmitting(false)
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
			file: null,
		})
	}

	const addChoice = () => {
		const currentChoices = form.getValues('choices')
		form.setValue('choices', [
			...currentChoices,
			{ textUZ: '', textUZK: '', textRU: '', isCorrect: false },
		])
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
							<Tabs defaultValue='uz' className='w-full'>
								<TabsList className='grid w-full grid-cols-3'>
									<TabsTrigger value='uz'>Ozbekcha (Lotin)</TabsTrigger>
									<TabsTrigger value='uzk'>Ўзбекча (Кирил)</TabsTrigger>
									<TabsTrigger value='ru'>Русский</TabsTrigger>
								</TabsList>

								<TabsContent value='uz' className='space-y-4'>
									<FormField
										control={form.control}
										name='questionUZ'
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
										name='explanationUZ'
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
								</TabsContent>

								<TabsContent value='uzk' className='space-y-4'>
									<FormField
										control={form.control}
										name='questionUZK'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Савол матни</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Саволни киритинг'
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
										name='explanationUZK'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Савол изоҳи</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Савол изоҳини киритинг'
														className='resize-none'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent value='ru' className='space-y-4'>
									<FormField
										control={form.control}
										name='questionRU'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Текст вопроса</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Введите вопрос'
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
										name='explanationRU'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Объяснение вопроса</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Введите объяснение вопроса'
														className='resize-none'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>
							</Tabs>

							<div>
								<FormLabel className='flex items-center justify-between'>
									<span>Rasm (ixtiyoriy)</span>
									{imagePreview && (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={removeImage}
											className='text-destructive hover:text-destructive'
										>
											<X className='h-4 w-4 mr-2' />
											Rasmni o&apos;chirish
										</Button>
									)}
								</FormLabel>
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
												height={300}
												className='rounded-lg max-h-[300px] w-auto object-contain'
											/>
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
									<div key={index} className='space-y-4'>
										<Tabs defaultValue='uz' className='w-full'>
											<TabsList className='grid w-full grid-cols-3'>
												<TabsTrigger value='uz'>Ozbekcha (Lotin)</TabsTrigger>
												<TabsTrigger value='uzk'>Ўзбекча (Кирил)</TabsTrigger>
												<TabsTrigger value='ru'>Русский</TabsTrigger>
											</TabsList>

											<TabsContent value='uz'>
												<FormField
													control={form.control}
													name={`choices.${index}.textUZ`}
													render={({ field }) => (
														<FormItem>
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
											</TabsContent>

											<TabsContent value='uzk'>
												<FormField
													control={form.control}
													name={`choices.${index}.textUZK`}
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input
																	placeholder={`${index + 1}-вариант`}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</TabsContent>

											<TabsContent value='ru'>
												<FormField
													control={form.control}
													name={`choices.${index}.textRU`}
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input
																	placeholder={`Вариант ${index + 1}`}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</TabsContent>
										</Tabs>

										<div className='flex items-center justify-between'>
											<FormField
												control={form.control}
												name={`choices.${index}.isCorrect`}
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
																		const choices = form.getValues('choices')
																		choices.forEach((_, i) => {
																			form.setValue(
																				`choices.${i}.isCorrect`,
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
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-4'>
						<Link href='/admin/tests'>
							<Button variant='outline'>Bekor qilish</Button>
						</Link>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

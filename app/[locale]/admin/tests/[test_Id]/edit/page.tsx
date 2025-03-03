'use client'

import { useState, useEffect, use } from 'react'
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
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { getTestById, updateTest } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

const formSchema = z.object({
	questionUZ: z.string().min(10, {
		message: "Savol matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	questionUZK: z.string().min(10, {
		message: 'Savol matni камида 10 та белгидан иборат бўлиши керак',
	}),
	questionRU: z.string().min(10, {
		message: 'Текст вопроса должен содержать не менее 10 символов',
	}),
	explanationUZ: z.string().min(10, {
		message: "Tushuntirish matni kamida 10 ta belgidan iborat bo'lishi kerak",
	}),
	explanationUZK: z.string().min(10, {
		message: 'Тушунтириш матни камида 10 та белгидан иборат бўлиши керак',
	}),
	explanationRU: z.string().min(10, {
		message: 'Текст объяснения должен содержать не менее 10 символов',
	}),
	choices: z
		.array(
			z.object({
				textUZ: z.string().min(1, 'Javob variantini kiriting'),
				textUZK: z.string().min(1, 'Жавоб вариантини киритинг'),
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

export default function Page({
	params,
}: {
	params: Promise<{ test_Id: string; language: string }>
}) {
	const router = useRouter()
	const { test_Id } = use(params)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [file, setFile] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [originalAnswers, setOriginalAnswers] = useState<any[]>([])
	const [originalValues, setOriginalValues] = useState<FormValues>({
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
	})

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: originalValues,
	})

	useEffect(() => {
		const fetchTest = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Fetch test data in all languages
				const responseUZ = await getTestById(test_Id, 'uz')
				const responseUZK = await getTestById(test_Id, 'uzk')
				const responseRU = await getTestById(test_Id, 'ru')

				if (responseUZ.isSuccess && responseUZ.result) {
					const testUZ = responseUZ.result
					const testUZK = responseUZK.result || testUZ
					const testRU = responseRU.result || testUZ

					// Store original answers for reference
					setOriginalAnswers(testUZ.testAnswers || [])

					const initialValues = {
						questionUZ: testUZ.question || '',
						questionUZK: testUZK.question || '',
						questionRU: testRU.question || '',
						explanationUZ: testUZ.explanation || '',
						explanationUZK: testUZK.explanation || '',
						explanationRU: testRU.explanation || '',
						choices: testUZ.testAnswers
							? testUZ.testAnswers.map((answer, index) => ({
									id: answer.id,
									textUZ: answer.answerText || '',
									textUZK: testUZK?.testAnswers[index]?.answerText || '',
									textRU: testRU?.testAnswers[index]?.answerText || '',
									isCorrect: answer.isCorrect,
							  }))
							: [
									{ textUZ: '', textUZK: '', textRU: '', isCorrect: false },
									{ textUZ: '', textUZK: '', textRU: '', isCorrect: false },
							  ],
						media: {
							exist: !!testUZ.mediaUrl,
							file: null,
						},
					}

					form.reset(initialValues)
					setOriginalValues(initialValues)

					if (testUZ.mediaUrl) {
						setImageUrl(`http://213.230.109.74:8080/${testUZ.mediaUrl}`)
					}
				} else {
					setError(
						responseUZ.errorMessages?.join(', ') ||
							"Test ma'lumotlarini yuklashda xatolik"
					)
				}
			} catch (error) {
				console.error('Error fetching test:', error)
				setError("Test ma'lumotlarini yuklashda xatolik yuz berdi")
			} finally {
				setIsLoading(false)
			}
		}
		fetchTest()
	}, [test_Id, form])

	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true)

			const formData = new FormData()

			if (values.questionUZ !== originalValues.questionUZ) {
				formData.append('questionUZ', values.questionUZ)
			}
			if (values.questionUZK !== originalValues.questionUZK) {
				formData.append('questionUZK', values.questionUZK)
			}
			if (values.questionRU !== originalValues.questionRU) {
				formData.append('questionRU', values.questionRU)
			}
			if (values.explanationUZ !== originalValues.explanationUZ) {
				formData.append('explanationUZ', values.explanationUZ)
			}
			if (values.explanationUZK !== originalValues.explanationUZK) {
				formData.append('explanationUZK', values.explanationUZK)
			}
			if (values.explanationRU !== originalValues.explanationRU) {
				formData.append('explanationRU', values.explanationRU)
			}

			if (file) {
				formData.append('media', file, file.name)
			}

			values.choices.forEach((choice, index) => {
				const originalChoice = originalValues.choices[index]
				if (
					!originalChoice ||
					choice.textUZ !== originalChoice.textUZ ||
					choice.textUZK !== originalChoice.textUZK ||
					choice.textRU !== originalChoice.textRU ||
					choice.isCorrect !== originalChoice.isCorrect
				) {
					const answerId = originalAnswers[index]?.id || `new-${index}`
					formData.append(`answers[${index}].id`, answerId)
					formData.append(`answers[${index}].testCaseId`, test_Id)
					formData.append(`answers[${index}].answerText`, choice.textUZ)
					formData.append(`answers[${index}].answerTextUZ`, choice.textUZ)
					formData.append(`answers[${index}].answerTextUZK`, choice.textUZK)
					formData.append(`answers[${index}].answerTextRU`, choice.textRU)
					formData.append(
						`answers[${index}].isCorrect`,
						choice.isCorrect.toString()
					)
				}
			})

			const response = await updateTest(test_Id, formData)

			if (response.isSuccess) {
				toast.success('Test muvaffaqiyatli yangilandi')
				router.push('/admin/tests')
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			console.error('Error updating test:', error)
			toast.error('Test yangilashda xatolik yuz berdi')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0]
			setFile(selectedFile)

			const reader = new FileReader()
			reader.onload = () => {
				setImageUrl(reader.result as string)
			}
			reader.readAsDataURL(selectedFile)

			form.setValue('media.exist', true)
		}
	}

	const removeImage = () => {
		setImageUrl(null)
		setFile(null)
		form.setValue('media.exist', false)
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
			const newChoices = currentChoices.filter((_, i) => i !== index)
			if (currentChoices[index].isCorrect && newChoices.length > 0) {
				newChoices[0].isCorrect = true
			}
			form.setValue('choices', newChoices)
		} else {
			toast.error("Kamida 2 ta javob varianti bo'lishi kerak")
		}
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='flex flex-col items-center gap-2'>
					<Loader2 className='h-8 w-8 animate-spin text-primary' />
					<p className='text-muted-foreground'>
						Test ma&apos;lumotlari yuklanmoqda...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-destructive'>
						Xatolik yuz berdi
					</h2>
					<p className='text-muted-foreground mt-2'>{error}</p>
					<Button
						variant='outline'
						className='mt-4'
						onClick={() => router.push('/admin/tests')}
					>
						Orqaga qaytish
					</Button>
				</div>
			</div>
		)
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
						Savolni tahrirlash
					</h2>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Savol ma&apos;lumotlari</CardTitle>
							<CardDescription>
								Savolning asosiy ma&apos;lumotlarini tahrirlang
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<Tabs defaultValue='uz' className='w-full'>
								<TabsList className='grid w-full grid-cols-3'>
									<TabsTrigger value='uz'>O&apos;zbekcha (Lotin)</TabsTrigger>
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
														className='min-h-[100px]'
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
														className='min-h-[100px]'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='space-y-4'>
										{form.getValues('choices').map((_, index) => (
											<FormField
												key={index}
												control={form.control}
												name={`choices.${index}.textUZ`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className='flex items-center gap-4'>
																<Input
																	placeholder={`${index + 1}-variant`}
																	className='flex-1'
																	{...field}
																/>
																<FormField
																	control={form.control}
																	name={`choices.${index}.isCorrect`}
																	render={({ field: radioField }) => (
																		<FormItem>
																			<FormControl>
																				<div className='flex items-center gap-2'>
																					<Input
																						type='radio'
																						name='correctAnswer'
																						className='w-4 h-4 text-primary border-gray-300 focus:ring-primary'
																						checked={radioField.value}
																						onChange={() => {
																							const choices =
																								form.getValues('choices')
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
																					{form.getValues('choices').length >
																						2 && (
																						<Button
																							type='button'
																							variant='destructive'
																							size='sm'
																							onClick={() =>
																								removeChoice(index)
																							}
																							className='hover:text-destructive'
																						>
																							<X className='h-4 w-4 mr-2' />
																						</Button>
																					)}
																				</div>
																			</FormControl>
																		</FormItem>
																	)}
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										))}
									</div>
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
														className='min-h-[100px]'
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
														className='min-h-[100px]'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='space-y-4'>
										{form.getValues('choices').map((_, index) => (
											<FormField
												key={index}
												control={form.control}
												name={`choices.${index}.textUZK`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className='flex items-center gap-4'>
																<Input
																	placeholder={`${index + 1}-вариант`}
																	className='flex-1'
																	{...field}
																/>
																<FormField
																	control={form.control}
																	name={`choices.${index}.isCorrect`}
																	render={({ field: radioField }) => (
																		<FormItem>
																			<FormControl>
																				<div className='flex items-center gap-2'>
																					<Input
																						type='radio'
																						name='correctAnswer'
																						className='w-4 h-4 text-primary border-gray-300 focus:ring-primary'
																						checked={radioField.value}
																						onChange={() => {
																							const choices =
																								form.getValues('choices')
																							choices.forEach((_, i) => {
																								form.setValue(
																									`choices.${i}.isCorrect`,
																									i === index
																								)
																							})
																						}}
																					/>
																					<span className='text-sm text-gray-600'>
																						Тўғри жавоб
																					</span>
																					{form.getValues('choices').length >
																						2 && (
																						<Button
																							type='button'
																							variant='destructive'
																							size='sm'
																							onClick={() =>
																								removeChoice(index)
																							}
																							className='hover:text-destructive'
																						>
																							<X className='h-4 w-4 mr-2' />
																						</Button>
																					)}
																				</div>
																			</FormControl>
																		</FormItem>
																	)}
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										))}
									</div>
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
														className='min-h-[100px]'
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
														className='min-h-[100px]'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='space-y-4'>
										{form.getValues('choices').map((_, index) => (
											<FormField
												key={index}
												control={form.control}
												name={`choices.${index}.textRU`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className='flex items-center gap-4'>
																<Input
																	placeholder={`Вариант ${index + 1}`}
																	className='flex-1'
																	{...field}
																/>
																<FormField
																	control={form.control}
																	name={`choices.${index}.isCorrect`}
																	render={({ field: radioField }) => (
																		<FormItem>
																			<FormControl>
																				<div className='flex items-center gap-2'>
																					<Input
																						type='radio'
																						name='correctAnswer'
																						className='w-4 h-4 text-primary border-gray-300 focus:ring-primary'
																						checked={radioField.value}
																						onChange={() => {
																							const choices =
																								form.getValues('choices')
																							choices.forEach((_, i) => {
																								form.setValue(
																									`choices.${i}.isCorrect`,
																									i === index
																								)
																							})
																						}}
																					/>
																					<span className='text-sm text-gray-600'>
																						Правильный ответ
																					</span>
																					{form.getValues('choices').length >
																						2 && (
																						<Button
																							type='button'
																							variant='destructive'
																							size='sm'
																							onClick={() =>
																								removeChoice(index)
																							}
																							className='hover:text-destructive'
																						>
																							<X className='h-4 w-4 mr-2' />
																						</Button>
																					)}
																				</div>
																			</FormControl>
																		</FormItem>
																	)}
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										))}
									</div>
								</TabsContent>
							</Tabs>

							{/* Variant qo'shish */}
							<div className='flex justify-end'>
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

							{/* Rasm qo'shish qismi */}
							<div>
								<FormLabel className='flex items-center justify-between'>
									<span>Rasm (ixtiyoriy)</span>
									{imageUrl && (
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
									{!imageUrl ? (
										<FormItem>
											<input
												type='file'
												name='media'
												id='media'
												title='Rasmni tanlang'
												accept='image/*'
												onChange={handleFileChange}
												className='block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-primary-foreground
                          hover:file:bg-primary/90'
											/>
										</FormItem>
									) : (
										<div className='relative'>
											<Image
												src={imageUrl}
												alt='Test image'
												width={600}
												height={400}
												className='rounded-lg max-h-[300px] w-auto object-contain'
											/>
										</div>
									)}
								</div>
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

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
import { createTest } from '@/lib/api'
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

export default function NewTest() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [file1, setFile] = useState<File | null>(null)
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

			const testData = {
				questionUZ: values.questionUZ,
				questionUZK: values.questionUZK,
				questionRU: values.questionRU,
				explanationUZ: values.explanationUZ,
				explanationUZK: values.explanationUZK,
				explanationRU: values.explanationRU,
				media: file1 || undefined,
				answers: values.choices.map(choice => ({
					answerTextUZ: choice.textUZ,
					answerTextUZK: choice.textUZK,
					answerTextRU: choice.textRU,
					isCorrect: choice.isCorrect,
				})),
			}

			const response = await createTest(testData)

			if (response.isSuccess) {
				toast.success('Test muvaffaqiyatli yaratildi')
				router.push('/admin/tests')
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			console.error('Error creating test:', error)
			toast.error('Test yaratishda xatolik yuz berdi')
		} finally {
			setIsSubmitting(false)
		}
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
														className=' min-h-[100px]'
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
														className=' min-h-[100px]'
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
																					<Button
																						variant={'destructive'}
																						onClick={() => removeChoice(index)}
																						size='sm'
																						className=' hover:text-destructive'
																					>
																						<X className='h-4 w-4 mr-2' />
																					</Button>
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
														className=' min-h-[100px]'
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
														className=' min-h-[100px]'
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
																					<Button
																						variant={'destructive'}
																						onClick={() => removeChoice(index)}
																						size={'sm'}
																						className=' hover:text-destructive'
																					>
																						<X className='h-4 w-4 mr-2' />
																					</Button>
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
														className='resize-none min-h-[100px]'
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
														className=' min-h-[100px]'
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
																					<Button
																						variant={'destructive'}
																						size='sm'
																						onClick={() => removeChoice(index)}
																						className=' hover:text-destructive'
																					>
																						<X className='h-4 w-4 mr-2' />
																					</Button>
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

							{/* Rasm qo'shish  qismi*/}
							<div>
								<FormLabel className='flex items-center justify-between'>
									<span>Rasm (ixtiyoriy)</span>
								</FormLabel>
								<div className='mt-2'>
									<FormItem>
										<input
											type='file'
											name='media'
											id='media'
											placeholder='Media'
											onChange={e => {
												if (e.target.files && e.target.files[0]) {
													setFile(e.target.files[0])
												}
											}}
										/>
									</FormItem>
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

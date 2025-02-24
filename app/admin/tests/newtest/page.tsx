'use client'

import { useEffect, useState } from 'react'
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
import { createTest } from '@/lib/api'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [currentLang, setCurrentLang] = useState('uz')

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

	useEffect(() => {
		console.log(file1)
	}, [file1])

	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true)

			//const mediaUrl = null
			// if (values.media?.exist && values.media.file) {
			// 	media = await uploadImage(values.media.file)
			// }

			const testData = {
				questionUZ: values.questionUZ,
				questionUZK: values.questionUZK,
				questionRU: values.questionRU,
				explanationUZ: values.explanationUZ,
				explanationUZK: values.explanationUZK,
				explanationRU: values.explanationRU,
				media: file1,
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

	const getLangLabel = (lang: string) => {
		switch (lang) {
			case 'uz':
				return "O'zbekcha (Lotin)"
			case 'uzk':
				return 'Ўзбекча (Кирил)'
			case 'ru':
				return 'Русский'
			default:
				return ''
		}
	}

	const getQuestionPlaceholder = (lang: string) => {
		switch (lang) {
			case 'uz':
				return 'Savolni kiriting'
			case 'uzk':
				return 'Саволни киритинг'
			case 'ru':
				return 'Введите вопрос'
			default:
				return ''
		}
	}

	const getExplanationPlaceholder = (lang: string) => {
		switch (lang) {
			case 'uz':
				return 'Savol izohini kiriting'
			case 'uzk':
				return 'Савол изоҳини киритинг'
			case 'ru':
				return 'Введите объяснение вопроса'
			default:
				return ''
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

			<Tabs
				value={currentLang}
				onValueChange={setCurrentLang}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-3 mb-6'>
					<TabsTrigger value='uz'>O&apos;zbekcha (Lotin)</TabsTrigger>
					<TabsTrigger value='uzk'>Ўзбекча (Кирил)</TabsTrigger>
					<TabsTrigger value='ru'>Русский</TabsTrigger>
				</TabsList>

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
								<div className='space-y-4'>
									<FormField
										control={form.control}
										name={
											`question${currentLang.toUpperCase()}` as
												| 'questionUZ'
												| 'questionUZK'
												| 'questionRU'
										}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Savol matni - {getLangLabel(currentLang)}
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={getQuestionPlaceholder(currentLang)}
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
										name={
											`explanation${currentLang.toUpperCase()}` as
												| 'explanationUZ'
												| 'explanationUZK'
												| 'explanationRU'
										}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Savol izohi - {getLangLabel(currentLang)}
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={getExplanationPlaceholder(currentLang)}
														className='resize-none min-h-[100px]'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormLabel className='flex items-center justify-between'>
										<span>Rasm (ixtiyoriy)</span>
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
										<FormLabel>
											Javob variantlari - {getLangLabel(currentLang)}
										</FormLabel>
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
										<div key={index} className='flex items-center gap-4'>
											<FormField
												control={form.control}
												name={
													`choices.${index}.text${currentLang.toUpperCase()}` as
														| `choices.${number}.textUZ`
														| `choices.${number}.textUZK`
														| `choices.${number}.textRU`
												}
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

											<div className='flex items-center gap-4'>
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
														className='text-destructive hover:text-destructive'
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
			</Tabs>
		</div>
	)
}

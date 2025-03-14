'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import { getTestById, updateTest } from '@/lib/test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LanguageTab } from '../../_components/language-tab'

const formSchema = z.object({
	QuestionUZ: z.string().min(2, {
		message: "Savol matni kamida 2 ta belgidan iborat bo'lishi kerak",
	}),
	QuestionUZK: z.string().min(2, {
		message: 'Savol matni камида 2 та белгидан иборат бўлиши керак',
	}),
	QuestionRU: z.string().min(2, {
		message: 'Текст вопроса должен содержать не менее 2 символов',
	}),
	ExplanationUZ: z.string().min(2, {
		message: "Tushuntirish matni kamida 2 ta belgidan iborat bo'lishi kerak",
	}),
	ExplanationUZK: z.string().min(2, {
		message: 'Тушунтириш матни камида 2 та белгидан иборат бўлиши керак',
	}),
	ExplanationRU: z.string().min(2, {
		message: 'Текст объяснения должен содержать не менее 2 символов',
	}),
	Answers: z
		.array(
			z.object({
				id: z.string().optional(),
				answerTextUZ: z.string().min(1, 'Javob variantini kiriting'),
				answerTextUZK: z.string().min(1, 'Жавоб вариантини киритинг'),
				answerTextRU: z.string().min(1, 'Введите вариант ответа'),
				isCorrect: z.boolean(),
			})
		)
		.min(2, 'Kamida 2 ta javob varianti kiriting')
		.refine(answers => answers.some(answer => answer.isCorrect), {
			message: "Kamida bitta to'g'ri javob belgilangan bo'lishi kerak",
		}),
})

type FormValues = z.infer<typeof formSchema>

export default function EditTest() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [mediaFile, setMediaFile] = useState<File | null>(null)
	const [mediaPreview, setMediaPreview] = useState<string | null>(null)
	//const [originalValues, setOriginalValues] = useState<FormValues | null>(null)
	const pathname = usePathname()
	const testID = pathname.split('/')[4]
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			QuestionUZ: '',
			QuestionUZK: '',
			QuestionRU: '',
			ExplanationUZ: '',
			ExplanationUZK: '',
			ExplanationRU: '',
			Answers: [
				{
					answerTextUZ: '',
					answerTextUZK: '',
					answerTextRU: '',
					isCorrect: false,
				},
				{
					answerTextUZ: '',
					answerTextUZK: '',
					answerTextRU: '',
					isCorrect: false,
				},
			],
		},
	})

	useEffect(() => {
		const fetchTest = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Fetch test data in all languages
				const responseUZ = await getTestById(testID, 'uz')
				const responseUZK = await getTestById(testID, 'uzk')
				const responseRU = await getTestById(testID, 'ru')

				if (responseUZ.isSuccess && responseUZ.result) {
					const testUZ = responseUZ.result
					const testUZK = responseUZK.isSuccess ? responseUZK.result : null
					const testRU = responseRU.isSuccess ? responseRU.result : null

					const initialValues = {
						QuestionUZ: testUZ.question || '',
						QuestionUZK: testUZK?.question || testUZ.question || '',
						QuestionRU: testRU?.question || testUZ.question || '',
						ExplanationUZ: testUZ.explanation || '',
						ExplanationUZK: testUZK?.explanation || testUZ.explanation || '',
						ExplanationRU: testRU?.explanation || testUZ.explanation || '',
						mediaUrl: testUZ.mediaUrl || '',
						Answers: testUZ.testAnswers.map((answer, index) => ({
							id: answer.id,
							answerTextUZ: answer.answerText || '',
							answerTextUZK:
								testUZK?.testAnswers[index]?.answerText ||
								answer.answerText ||
								'',
							answerTextRU:
								testRU?.testAnswers[index]?.answerText ||
								answer.answerText ||
								'',
							isCorrect: answer.isCorrect,
						})),
					}

					//setOriginalValues(initialValues)
					form.reset(initialValues)

					if (testUZ.mediaUrl) {
						setMediaPreview(`http://213.230.109.74:8080/${testUZ.mediaUrl}`)
					}
				} else {
					setError(
						responseUZ.errorMessages?.join(', ') ||
							"Ma'lumotlarni yuklashda xatolik"
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
	}, [testID, form])

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		console.log(file)

		if (file) {
			if (file.size > 10 * 1024 * 1024) {
				toast.error('Fayl hajmi 10MB dan oshmasligi kerak')
				return
			}

			if (!file.type.startsWith('image/')) {
				toast.error('Faqat rasm fayllarini yuklash mumkin')
				return
			}

			setMediaFile(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				setMediaPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const removeAnswer = (index: number) => {
		const currentAnswers = form.getValues('Answers')
		if (currentAnswers.length > 2) {
			form.setValue(
				'Answers',
				currentAnswers.filter((_, i) => i !== index)
			)
		} else {
			toast.error("Kamida 2 ta javob varianti bo'lishi kerak")
		}
	}

	const addAnswer = () => {
		const currentAnswers = form.getValues('Answers')
		if (currentAnswers.length < 10) {
			form.setValue('Answers', [
				...currentAnswers,
				{
					answerTextUZ: '',
					answerTextUZK: '',
					answerTextRU: '',
					isCorrect: false,
				},
			])
		} else {
			toast.error('Maksimal 10 ta javob varianti kiritish mumkin')
		}
	}

	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true)

			const formData = new FormData()
			formData.append('id', testID)

			// Add questions and explanations
			formData.append('questionUZ', values.QuestionUZ)
			formData.append('questionUZK', values.QuestionUZK)
			formData.append('questionRU', values.QuestionRU)
			formData.append('explanationUZ', values.ExplanationUZ)
			formData.append('explanationUZK', values.ExplanationUZK)
			formData.append('explanationRU', values.ExplanationRU)

			// Add media if changed
			if (mediaFile) {
				formData.append('Media', mediaFile)
			}

			// Add answers
			values.Answers.forEach((answer, index) => {
				if (answer.id) {
					formData.append(`Answers[${index}].id`, answer.id)
				}
				formData.append(`Answers[${index}].answerTextUZ`, answer.answerTextUZ)
				formData.append(`Answers[${index}].answerTextUZK`, answer.answerTextUZK)
				formData.append(`Answers[${index}].answerTextRU`, answer.answerTextRU)
				formData.append(
					`Answers[${index}].isCorrect`,
					answer.isCorrect.toString()
				)
			})

			const response = await updateTest('uz', formData)

			if (response.isSuccess) {
				toast.success('Test muvaffaqiyatli yangilandi')
				router.push(`${getLanguagePrefix()}/admin/tests`)
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			console.error('Test yangilashda xatolik:', error)
			toast.error('Test yangilashda xatolik yuz berdi')
		} finally {
			setIsSubmitting(false)
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
			<div className='space-y-6'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/tests`}>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>Xatolik</h2>
				</div>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center text-destructive'>
							<p>{error}</p>
							<Button
								variant='outline'
								className='mt-4'
								onClick={() =>
									router.push(`${getLanguagePrefix()}/admin/tests`)
								}
							>
								Orqaga qaytish
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
			<div className='max-w-full mx-auto space-y-8'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex items-center justify-between'
				>
					<div className='flex items-center gap-4'>
						<Link href={`${getLanguagePrefix()}/admin/tests`}>
							<Button variant='outline' size='icon'>
								<ArrowLeft className='h-4 w-4' />
							</Button>
						</Link>
						<h1 className='text-3xl font-bold tracking-tight'>
							Testni tahrirlash
						</h1>
					</div>
				</motion.div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<Card>
							<CardHeader>
								<CardTitle>Test ma&apos;lumotlari</CardTitle>
								<CardDescription>
									Barcha tillardagi savol va javoblarni tahrirlang
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<Tabs defaultValue='uz' className='w-full'>
									<TabsList className='grid w-full grid-cols-3'>
										<TabsTrigger value='uz'>O&apos;zbekcha</TabsTrigger>
										<TabsTrigger value='uzk'>Кирилча</TabsTrigger>
										<TabsTrigger value='ru'>Русский</TabsTrigger>
									</TabsList>

									<TabsContent value='uz'>
										<LanguageTab
											lang='uz'
											form={form}
											removeAnswer={removeAnswer}
										/>
									</TabsContent>

									<TabsContent value='uzk'>
										<LanguageTab
											lang='uzk'
											form={form}
											removeAnswer={removeAnswer}
										/>
									</TabsContent>

									<TabsContent value='ru'>
										<LanguageTab
											lang='ru'
											form={form}
											removeAnswer={removeAnswer}
										/>
									</TabsContent>
								</Tabs>

								<div className='flex justify-between items-center'>
									<Button
										type='button'
										variant='outline'
										onClick={addAnswer}
										disabled={form.getValues('Answers').length >= 6}
									>
										<Plus className='h-4 w-4 mr-2' />
										Javob qo&apos;shish
									</Button>

									<div className='flex items-center gap-4'>
										<label className='block'>
											<span className='sr-only'>Rasm tanlash</span>
											<Input
												type='file'
												accept='image/*'
												onChange={handleMediaChange}
												className='block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-primary-foreground
                          hover:file:bg-primary/90'
											/>
										</label>
									</div>
								</div>

								{mediaPreview && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='relative w-full h-48 rounded-lg overflow-hidden'
									>
										<Image
											src={mediaPreview}
											width={300}
											height={300}
											alt='Preview'
											className='w-full h-full object-contain'
										/>
										<Button
											type='button'
											variant='destructive'
											size='sm'
											className='absolute top-2 right-2'
											onClick={() => {
												setMediaFile(null)
												setMediaPreview(null)
											}}
										>
											<X className='h-4 w-4' />
										</Button>
									</motion.div>
								)}
							</CardContent>
						</Card>

						<div className='flex justify-end gap-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() =>
									router.push(`${getLanguagePrefix()}/admin/tests`)
								}
							>
								Bekor qilish
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									'Saqlash'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

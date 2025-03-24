'use client'

import { useState } from 'react'
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
import { createTest } from '@/lib/test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { LanguageTab } from '../_components/language-tab'
import Image from 'next/image'

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
	ExplanationUZ: z.string().min(0, {
		message: "Tushuntirish matni kamida 0 ta belgidan iborat bo'lishi kerak",
	}),
	ExplanationUZK: z.string().min(0, {
		message: 'Тушунтириш матни камида 0 та белгидан иборат бўлиши керак',
	}),
	ExplanationRU: z.string().min(0, {
		message: 'Текст объяснения должен содержать не менее 0 символов',
	}),
	Answers: z
		.array(
			z.object({
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

export default function CreateTest() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [mediaFile, setMediaFile] = useState<File | null>(null)
	const [mediaPreview, setMediaPreview] = useState<string | null>(null)
	const pathname = usePathname()

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

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
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

	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true)

			const testData = {
				...values,
				Media: mediaFile || undefined,
			}

			const response = await createTest(testData)

			if (response.isSuccess) {
				toast.success('Test muvaffaqiyatli yaratildi')
				router.push(`${getLanguagePrefix()}/admin/tests`)
				console.log('Test yaratildi:', response.result)
			} else {
				toast.error(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
			}
		} catch (error) {
			console.log('Test yaratishda xatolik:', error)
			toast.error('Test yaratishda xatolik yuz berdi')
		} finally {
			setIsSubmitting(false)
		}
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
							Yangi test yaratish
						</h1>
					</div>
				</motion.div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<Card>
							<CardHeader>
								<CardTitle>Test ma&apos;lumotlari</CardTitle>
								<CardDescription>
									Barcha tillardagi savol va javoblarni kiriting
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

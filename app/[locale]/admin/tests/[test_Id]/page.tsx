'use client'

import { use, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Pencil, Trash2, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { getTestById, deleteTest } from '@/lib/api'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
interface TestData {
	id: string
	question: string
	questionUZ?: string
	questionUZK?: string
	questionRU?: string
	explanation: string
	explanationUZ?: string
	explanationUZK?: string
	explanationRU?: string
	mediaUrl: string | null
	testAnswers: {
		id: string
		testCaseId: string
		answerText: string
		answerTextUZ?: string
		answerTextUZK?: string
		answerTextRU?: string
		isCorrect: boolean
	}[]
}

export default function QuestionDetails({
	params,
}: {
	params: Promise<{ test_Id: string; language: string }>
}) {
	const t = useTranslations('Testadmin')

	const { test_Id } = use(params)
	const router = useRouter()

	const [testData, setTestData] = useState<TestData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [imageError, setImageError] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	useEffect(() => {
		const fetchTestData = async () => {
			try {
				const response = await getTestById(test_Id, language)
				if (response.isSuccess) {
					setTestData(response.result)
				} else {
					setError(response.errorMessages?.join(', ') || 'Xatolik yuz berdi')
				}
				setIsLoading(false)
			} catch (error) {
				setError("Test ma'lumotlarini yuklashda xatolik yuz berdi")
				console.error('Error fetching test:', error)
			} finally {
				setIsLoading(false)
			}
		}
		if (test_Id) {
			fetchTestData()
		}
	}, [test_Id, language])
	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}
	const handleDelete = async () => {
		try {
			const response = await deleteTest(test_Id)
			if (response.isSuccess) {
				toast.success("Test muvaffaqiyatli o'chirildi")
				router.push(getLanguagePrefix() + '/admin/tests')
			} else {
				toast.error(
					response.errorMessages?.join(', ') ||
						"Testni o'chirishda xatolik yuz berdi"
				)
			}
		} catch (error) {
			toast.error("Testni o'chirishda xatolik yuz berdi")
			console.error('Error deleting question:', error)
		}
	}

	const handleImageError = () => {
		setImageError(true)
	}

	const getLanguageLabel = (lang: string) => {
		switch (lang) {
			case 'uz':
				return "O'zbekcha (Lotin)"
			case 'uzk':
				return 'Ўзбекча (Кирил)'
			case 'ru':
				return 'Русский'
			default:
				return "O'zbekcha (Lotin)"
		}
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
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/tests`}>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>Yuklanmoqda...</h2>
				</div>
				<Card>
					<CardContent className='p-6'>
						<div className='space-y-4'>
							<div className='h-4 w-3/4 bg-muted animate-pulse rounded'></div>
							<div className='h-20 bg-muted animate-pulse rounded'></div>
							<div className='space-y-2'>
								{[1, 2, 3].map(i => (
									<div
										key={i}
										className='h-10 bg-muted animate-pulse rounded'
									></div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/tests`}>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						{t('Savol malumotlari')}
					</h2>
				</div>
				<div className='flex gap-2'>
					<Link href={`${getLanguagePrefix()}/admin/tests/${test_Id}/edit`}>
						<Button variant='outline' className='gap-2'>
							<Pencil className='h-4 w-4' />
							Tahrirlash
						</Button>
					</Link>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='destructive' className='gap-2'>
								<Trash2 className='h-4 w-4' />
								O&apos;chirish
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Savolni o&apos;chirishni tasdiqlaysizmi?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Bu amalni qaytarib bo&apos;lmaydi. Savol va unga tegishli
									barcha ma&apos;lumotlar butunlay o&apos;chiriladi.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Bekor qilish</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								>
									O&apos;chirish
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>
							{t('Savol malumotlari')} - {getLanguageLabel(language)}
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Savol matni</p>
							<p className='font-medium'>{testData?.question}</p>
						</div>

						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Savol izohi</p>
							<p className='text-sm'>{testData?.explanation}</p>
						</div>

						<div className='space-y-2'>
							<p className='text-sm text-muted-foreground'>Javob variantlari</p>
							<div className='space-y-2'>
								{testData?.testAnswers.map(answer => (
									<div
										key={answer.id}
										className={`p-3 rounded-lg  ${
											answer.isCorrect
												? 'bg-green-500/10 border border-green-500/20'
												: 'bg-yellow-500/10 border border-yellow-500/40'
										}`}
									>
										<p
											className={`${answer.isCorrect ? 'text-green-600' : ''}`}
										>
											{answer.answerText}
											{answer.isCorrect &&
												(language === 'ru'
													? ' (Правильный ответ)'
													: language === 'uzk'
													? ' (Тўғри жавоб)'
													: " (To'g'ri javob)")}
										</p>
									</div>
								))}
							</div>
						</div>

						{testData?.mediaUrl && (
							<div className='space-y-2'>
								<p className='text-sm text-muted-foreground'>Savol Rasmi</p>
								<div className='rounded-lg overflow-hidden border w-1/2 h-1/2'>
									{!imageError ? (
										<Image
											src={`http://213.230.109.74:8080/${testData.mediaUrl}`}
											alt='Question illustration'
											width={500}
											height={300}
											className='w-full h-auto object-contain'
											onError={handleImageError}
										/>
									) : (
										<div className='w-full h-[300px] bg-muted flex items-center justify-center'>
											<ImageIcon className='h-8 w-8 text-muted-foreground' />
										</div>
									)}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, LucideEye, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getUserById } from '@/lib/users'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { ExemItem, getExemsUser } from '@/lib/test'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
		},
	},
}

interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}

export default function StudentDashboard() {
	const pathname = usePathname()
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const Id = pathname.split('/')[3]
	const [userData, setUserData] = useState<UserData | null>(null)
	const [exemItem, setExemItem] = useState<ExemItem[]>([])
	const [pageNumber, setPageNumber] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const t = useTranslations('Student')

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	const fetchExemResult = async (page: number) => {
		try {
			const exemResponse = await getExemsUser({
				UserID: Id,
				pageSize: 5,
				pageNumber: page,
			})

			setExemItem(exemResponse.items)
			setTotalPages(exemResponse.totalPages)
		} catch (error) {
			toast(`Imtixon natijalarini yuklashda xatolik bor: ${error}`)
		}
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getUserById(Id)
				if (response.isSuccess && response.result) {
					setUserData(response.result)
				} else {
					setError(
						response.errorMessages?.join(', ') ||
							"Ma'lumotlarni yuklashda xatolik yuz berdi"
					)
				}
			} catch (error) {
				setError("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi")
				console.error('Error fetching user:', error)
			} finally {
				setLoading(false)
			}
		}

		if (Id) {
			fetchUser()
			fetchExemResult(pageNumber)
		}
	}, [Id, pageNumber])

	const handlePageChange = (newPage: number) => {
		setPageNumber(newPage)
	}

	const setStatus = (correctanswer: number, totolQuestion: number) => {
		if ((correctanswer / totolQuestion) * 100 >= 90) {
			return (
				<Badge variant={'secondary'} className='bg-green-300 dark:text-black'>
					{t('topshirdi')}
				</Badge>
			)
		}
		return <Badge variant={'destructive'}>{t('topshirmadi')}</Badge>
	}

	if (loading) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle>{t('shaxsiykabinet')}</CardTitle>
					</CardHeader>
					<CardContent className='grid grid-cols-2 gap-4'>
						{[1, 2, 3, 4].map(i => (
							<div key={i}>
								<div className='h-4 w-24 bg-muted animate-pulse mb-2'></div>
								<div className='h-6 w-32 bg-muted animate-pulse'></div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className='space-y-4'>
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

	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='space-y-8'
		>
			<motion.div
				variants={item}
				className='relative overflow-hidden rounded-lg bg-gradient-to-r from-green-400 via-green-300 to-green-400 p-3 border shadow-lg'
			>
				<div className='absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/5' />
				<h1 className='text-4xl font-bold tracking-tight mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
					{userData?.name} {userData?.surname}
				</h1>
				<p>{t('shaxsiykabinet')}</p>
			</motion.div>

			{/* Test Results */}
			<motion.div variants={item}>
				<Card className='relative overflow-hidden border-1 transition-colors hover:border-primary/50 group'>
					<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
					<CardHeader className='flex flex-row items-center justify-between pb-1'>
						<CardTitle className='text-xl font-bold flex items-center gap-2'>
							<Trophy className='w-8 h-8 text-amber-600 animate-pulse' />
							{t('testnatijalari')}
						</CardTitle>
					</CardHeader>
					<CardContent className='pt-2'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('sana')}</TableHead>
									<TableHead>{t('togrijavoblar')}</TableHead>
									<TableHead>{t('status')}</TableHead>
									<TableHead className='text-right'>
										{t('tekshirish')}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{exemItem.map((test, index) => (
									<TableRow
										key={index}
										className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
									>
										<TableCell>
											{new Date(test.createAt).toLocaleDateString('uz-UZ')}
										</TableCell>
										<TableCell>
											{test.corrertAnswers} / {test.questionCount}
										</TableCell>
										<TableCell>
											{test.questionCount &&
												setStatus(test.corrertAnswers, test.questionCount)}
										</TableCell>
										<TableCell className='text-right'>
											<Link
												href={`${getLanguagePrefix()}/student/${Id}/dashboard/${
													test.id
												}`}
												className='inline-flex items-center justify-center p-2 rounded-md hover:bg-primary/10 transition-colors'
											>
												<LucideEye className='w-5 h-5 text-primary' />
												<span className='sr-only'>{t('tekshirish')}</span>
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<div className='flex justify-center gap-6 mt-4'>
					<Button
						variant='custom'
						disabled={pageNumber <= 0} // Sahifa 0 bo'lsa oldingi bosib bo'lmaydi
						onClick={() => handlePageChange(pageNumber - 1)}
					>
						<ArrowLeft /> oldingi
					</Button>

					<Button
						variant='custom'
						disabled={totalPages === 0 || pageNumber >= totalPages - 1} // totalPages mavjudligini tekshirish
						onClick={() => handlePageChange(pageNumber + 1)}
						className='ml-2'
					>
						keyingi <ArrowRight />
					</Button>
				</div>
			</motion.div>
		</motion.div>
	)
}

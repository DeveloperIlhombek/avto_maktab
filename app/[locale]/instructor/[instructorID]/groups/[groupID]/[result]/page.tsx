'use client'

import React, { useEffect, useState } from 'react'
import { ExemItem, getExemsUser } from '@/lib/test'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { usePathname } from 'next/navigation'
import { LucideEye, Trophy } from 'lucide-react'
import Link from 'next/link'
function Page() {
	const [exemItem, setExemItem] = useState<ExemItem[]>([])
	const pathname = usePathname()
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const Id = pathname.split('/')[6]
	const InstrucId = pathname.split('/')[3]
	const groupId = pathname.split('/')[5]
	useEffect(() => {
		const fetchExemResult = async () => {
			try {
				setLoading(true)
				setError(null)
				const exemResponse = await getExemsUser({
					UserID: Id,
					pageSize: 20,
					pageNumber: 0,
				})
				setExemItem(exemResponse.items)
			} catch (error) {
				setError(`Test natihalarini yuklashda xatolik yuz berdi ${error}`)
			} finally {
				setLoading(false)
			}
		}

		if (Id) {
			fetchExemResult()
		}
	}, [Id])
	const setStatus = (correctanswer: number, totolQuestion: number) => {
		if ((correctanswer / totolQuestion) * 100 >= 90) {
			return (
				<Badge variant={'secondary'} className='bg-green-300 dark:text-black'>
					O&apos;tdi
				</Badge>
			)
		}
		return <Badge variant={'destructive'}>O&apos;tmadi</Badge>
	}

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	if (loading) {
		return (
			<div className='space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle>Shaxsiy kabinet</CardTitle>
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
	return (
		<>
			<motion.div
				variants={container}
				initial='hidden'
				animate='show'
				className='space-y-8'
			>
				{/* Test Results */}
				<motion.div variants={item}>
					<Card className='relative overflow-hidden border-2 transition-colors hover:border-primary/50 group'>
						<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-xl font-bold flex items-center gap-2'>
								<Trophy className='w-5 h-5 text-primary animate-pulse' />
								Test Natijalari
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-4'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sana</TableHead>
										<TableHead>To&apos;g&apos;ri javoblar</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Javoblar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{exemItem.map((test, index) => (
										<TableRow key={index}>
											<TableCell>
												{new Date(test.createAt).toLocaleDateString('uz-UZ')}
											</TableCell>
											<TableCell>
												{test.corrertAnswers} / {test.questionCount}{' '}
											</TableCell>
											<TableCell>
												{test.questionCount &&
													setStatus(test.corrertAnswers, test.questionCount)}
											</TableCell>
											<TableCell className='text-right'>
												<Link
													href={`${getLanguagePrefix()}/instructor/${InstrucId}/groups/${groupId}/${Id}/${
														test.id
													}`}
													className='inline-flex items-center justify-center p-2 rounded-md hover:bg-primary/10 transition-colors'
												>
													<LucideEye className='w-5 h-5 text-primary' />
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
		</>
	)
}

export default Page

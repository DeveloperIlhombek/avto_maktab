'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { ExemItem, getExemsUser } from '@/lib/test'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { LucideEye } from 'lucide-react'

export function TestsTab() {
	const pathname = usePathname()
	const userId = pathname.split('/')[4]
	const [exemItem, setExemItem] = useState<ExemItem[]>([])
	//const [pageNumber, setPageNumber] = useState(0)
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		// Check if the first segment after the initial slash is a language code
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	useEffect(() => {
		const fetchStudentExem = async () => {
			try {
				const resultExem = await getExemsUser({
					UserID: userId,
					pageSize: 1000,
					pageNumber: 0,
				})

				console.log(resultExem)
				setExemItem(resultExem.items)
			} catch (error) {
				toast(`Xatlik mavjud:  ${error}`)
			}
		}
		fetchStudentExem()
	}, [userId])

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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Test natijalari</CardTitle>
				<CardDescription>
					O&apos;quvchining test sinovlari natijalari
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Sana</TableHead>
							<TableHead>To&apos;g&apos;ri javoblar</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>Natijalar</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{exemItem.map((test, index) => (
							<TableRow key={index}>
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
										href={`${getLanguagePrefix()}/admin/students/${userId}/${
											test.id
										}`}
										className='inline-flex items-center justify-center p-2 rounded-md hover:bg-primary/10 transition-colors'
									>
										<LucideEye className='w-5 h-5 text-primary' />
										<span className='sr-only'>Tekshirish</span>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

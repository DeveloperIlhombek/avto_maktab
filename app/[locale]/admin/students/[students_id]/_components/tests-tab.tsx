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
import { ExemItem, getExemsUser } from '@/lib/users'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function TestsTab() {
	const pathname = usePathname()
	const userId = pathname.split('/')[4]
	const [exemItem, setExemItem] = useState<ExemItem[]>([])
	//const [pageNumber, setPageNumber] = useState(0)
	useEffect(() => {
		const fetchStudentExem = async () => {
			try {
				const resultExem = await getExemsUser({
					UserID: userId,
					pageSize: 100,
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
							<TableHead>Ball</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{exemItem.map((test, index) => (
							<TableRow key={index}>
								<TableCell>
									{new Date(test.createAt).toLocaleDateString('uz-UZ')}
								</TableCell>
								<TableCell>{test.corrertAnswers} / 20</TableCell>
								<TableCell>{setStatus(19, 20)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Search,
	Plus,
	Pencil,
	Trash2,
	Eye,
	Image as ImageIcon,
} from 'lucide-react'
import { getAllTestsAdmin } from '@/lib/api'
import type { Test } from '@/lib/api'

export default function QuestionsPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const [tests, setTests] = useState<Test[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

	const pageSize = 10

	useEffect(() => {
		fetchTests()
	}, [currentPage])

	const fetchTests = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await getAllTestsAdmin(currentPage, pageSize)

			if (data.isSuccess) {
				setTests(data.result.items)
				setTotalPages(data.result.totalPages)
				setTotalCount(data.result.totalCount)
			} else {
				setError(data.errorMessages?.join(', ') || 'Failed to fetch tests')
			}
		} catch (error) {
			setError('Failed to fetch tests')
			console.error('Error fetching tests:', error)
		} finally {
			setLoading(false)
		}
	}

	const filteredTests = tests.filter(test =>
		test.question.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return null
		if (mediaUrl.startsWith('Files/')) {
			return `http://213.230.109.74:8080/${mediaUrl}`
		}
		return null
	}

	const handleImageError = (testId: string) => {
		setImageErrors(prev => ({ ...prev, [testId]: true }))
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Savollar</h2>
					<p className='text-muted-foreground'>
						Barcha test savollari ro&apos;yxati va boshqaruvi
					</p>
				</div>
				<Link href='/admin/tests/newtest'>
					<Button className='gap-2'>
						<Plus className='h-4 w-4' />
						Yangi savol
					</Button>
				</Link>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Savol qidirish...'
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Savollar ro&apos;yxati</CardTitle>
					<CardDescription>Jami {totalCount} ta savol</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center items-center py-8'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
						</div>
					) : error ? (
						<div className='text-center text-destructive py-8'>{error}</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Rasm</TableHead>
										<TableHead className='w-[400px]'>Savol</TableHead>
										<TableHead>To&apos;g&apos;ri javob</TableHead>
										<TableHead className='text-right'>Amallar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredTests.map(test => (
										<TableRow key={test.id} className='group'>
											<TableCell>
												{getImageUrl(test.mediaUrl) && !imageErrors[test.id] ? (
													<Image
														src={getImageUrl(test.mediaUrl)!}
														alt={test.question}
														width={100}
														height={60}
														className='rounded object-cover'
														onError={() => handleImageError(test.id)}
													/>
												) : (
													<div className='w-[100px] h-[60px] bg-muted rounded flex items-center justify-center'>
														<ImageIcon className='h-6 w-6 text-muted-foreground' />
													</div>
												)}
											</TableCell>
											<TableCell className='font-medium'>
												{test.question}
											</TableCell>
											<TableCell>
												{
													test.testAnswers.find(answer => answer.isCorrect)
														?.answerText
												}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-2 opacity-100'>
													<Link href={`/admin/tests/${test.id}`}>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<Eye className='h-4 w-4' />
														</Button>
													</Link>
													<Link href={`/admin/tests/${test.id}/edit`}>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<Pencil className='h-4 w-4' />
														</Button>
													</Link>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8 text-destructive'
													>
														<Trash2 className='h-4 w-4' />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<div className='mt-4'>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href='#'
												onClick={() =>
													setCurrentPage(prev => Math.max(0, prev - 1))
												}
												className={
													currentPage === 0
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>

										{[...Array(totalPages)].map((_, index) => {
											// Show first page, current page, last page, and neighbors
											if (
												index === 0 ||
												index === totalPages - 1 ||
												(index >= currentPage - 1 && index <= currentPage + 1)
											) {
												return (
													<PaginationItem key={index}>
														<PaginationLink
															href='#'
															onClick={() => setCurrentPage(index)}
															isActive={currentPage === index}
														>
															{index + 1}
														</PaginationLink>
													</PaginationItem>
												)
											}
											// Show ellipsis
											if (index === 1 || index === totalPages - 2) {
												return (
													<PaginationItem key={index}>
														<PaginationEllipsis />
													</PaginationItem>
												)
											}
											return null
										})}

										<PaginationItem>
											<PaginationNext
												href='#'
												onClick={() =>
													setCurrentPage(prev =>
														Math.min(totalPages - 1, prev + 1)
													)
												}
												className={
													currentPage === totalPages - 1
														? 'pointer-events-none opacity-50'
														: ''
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

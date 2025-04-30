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
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from '@/components/ui/pagination'
import { Search, Plus, Pencil, Eye, Image as ImageIcon } from 'lucide-react'
import { getAllTestsAdmin } from '@/lib/test'
import type { Test } from '@/lib/test'
import { usePathname } from 'next/navigation'

export default function QuestionsPage() {
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	const [searchTerm, setSearchTerm] = useState('')
	const [orderNumberSearch, setOrderNumberSearch] = useState('')
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
	}, [currentPage, language, searchTerm, orderNumberSearch])

	const fetchTests = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await getAllTestsAdmin(
				searchTerm || orderNumberSearch ? 0 : currentPage,
				searchTerm || orderNumberSearch ? 2000 : pageSize,
				language
			)

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

	// Savol matni bo'yicha filtr
	const filterByQuestion = (test: Test, term: string) => {
		if (!term) return true
		return test.question.toLowerCase().includes(term.toLowerCase())
	}

	// Tartib raqami bo'yicha filtr
	const filterByOrderNumber = (test: Test, number: string) => {
		if (!number) return true
		const parsedNumber = parseInt(number, 10)
		if (isNaN(parsedNumber)) return false
		return test.number === parsedNumber
	}

	// Filtrlash logikasi
	const filteredTests = tests.filter(test => {
		if (searchTerm && !orderNumberSearch) {
			return filterByQuestion(test, searchTerm)
		}
		if (orderNumberSearch && !searchTerm) {
			return filterByOrderNumber(test, orderNumberSearch)
		}
		return true
	})

	const getImageUrl = (mediaUrl: string | null) => {
		if (!mediaUrl || mediaUrl === '1') return null
		if (mediaUrl.startsWith('Files/')) {
			return `${process.env.NEXT_PUBLIC_API_URL}/${mediaUrl}`
		}
		return null
	}

	const handleImageError = (testId: string) => {
		setImageErrors(prev => ({ ...prev, [testId]: true }))
	}

	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}

	// Input o'zgarganda boshqa maydonni bo'shatish
	const handleSearchTermChange = (value: string) => {
		setSearchTerm(value)
		if (value) setOrderNumberSearch('') // Tartib raqamini bo'shatish
	}

	const handleOrderNumberChange = (value: string) => {
		setOrderNumberSearch(value)
		if (value) setSearchTerm('') // Savol matnini bo'shatish
	}

	return (
		<div className='space-y-6 max-h-screen'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Savollar</h2>
					<p className='text-muted-foreground'>
						Barcha test savollari ro&apos;yxati va boshqaruvi
					</p>
				</div>
				<Link href={`${getLanguagePrefix()}/admin/tests/newtest`}>
					<Button className='gap-2' variant={'custom'}>
						<Plus className='h-4 w-4 font-bold' />
						Yangi savol
					</Button>
				</Link>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Savol matni bo‘yicha qidirish...'
							className='pl-8'
							value={searchTerm}
							onChange={e => handleSearchTermChange(e.target.value)}
						/>
					</div>
					<div className='relative flex-1 max-w-xs'>
						<Input
							type='number'
							placeholder='Tartib raqami bo‘yicha qidirish...'
							className='pl-8'
							value={orderNumberSearch}
							onChange={e => handleOrderNumberChange(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Savollar ro&apos;yxati</CardTitle>
					<CardDescription>
						{searchTerm || orderNumberSearch
							? `Qidiruv natijalari: ${filteredTests.length} ta savol`
							: `Jami ${totalCount} ta savol`}
					</CardDescription>
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
										<TableHead>Tartib raqami</TableHead>
										<TableHead>Rasm</TableHead>
										<TableHead className='w-[400px]'>Savol</TableHead>
										<TableHead>To&apos;g&apos;ri javob</TableHead>
										<TableHead className='text-right'>Amallar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredTests.map(test => (
										<TableRow key={test.id} className='group'>
											<TableCell>{test.number}</TableCell>
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
													<Link
														href={`${getLanguagePrefix()}/admin/tests/${
															test.id
														}`}
													>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<Eye className='h-4 w-4' />
														</Button>
													</Link>
													<Link
														href={`${getLanguagePrefix()}/admin/tests/${
															test.id
														}/edit`}
													>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<Pencil className='h-4 w-4' />
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{!searchTerm && !orderNumberSearch && totalPages > 1 && (
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
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

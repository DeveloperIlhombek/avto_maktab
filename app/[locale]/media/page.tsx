'use client'

import { getFolder, IFolderResult } from '@/lib/media'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FolderClosed,
	Loader2,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function MediaPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [totalPages, setTotalPages] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [media, setMedia] = useState<IFolderResult[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [isRetrying, setIsRetrying] = useState(false)

	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	const t = useTranslations('Media')

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	useEffect(() => {
		fetchMediaFolder(currentPage)
	}, [currentPage])

	const fetchMediaFolder = async (pageNumber: number) => {
		try {
			setLoading(true)
			setError(null)
			const response = await getFolder({ pageSize: 12, pageNumber })

			if (response.isSuccess) {
				setMedia(response.result.items)
				setTotalPages(response.totalPages)
				setTotalCount(response.result.totalCount)
			} else {
				throw new Error(
					response.errorMessages?.join(', ') || 'Failed to fetch folders'
				)
			}
		} catch (error) {
			setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
			console.error('Error fetching folders:', error)
		} finally {
			setLoading(false)
			setIsRetrying(false)
		}
	}

	const handleRetry = () => {
		setIsRetrying(true)
		fetchMediaFolder(currentPage)
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4'>
				<Button>
					<Link href={`${getLanguagePrefix()}`}>
						<ArrowLeft /> {t('ortga')}
					</Link>
				</Button>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className='max-w-md w-full'
				>
					<Alert variant='destructive' className='mb-4'>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
					<Button
						onClick={handleRetry}
						className='w-full'
						disabled={isRetrying}
					>
						{isRetrying ? (
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
						) : (
							<RefreshCw className='h-4 w-4 mr-2' />
						)}
						{t('qaytaurinish')}
					</Button>
				</motion.div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-sky-100/10 via-sky-300/30 to-sky-100/10 dark:from-sky-800/20  dark:via-sky-900/40   dark:to-sky-900/10 p-4 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				<Button variant={'custom'}>
					<Link
						href={`${getLanguagePrefix()}`}
						className='flex items-center justify-center gap-2'
					>
						<ArrowLeft /> {t('ortga')}
					</Link>
				</Button>

				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center space-y-2'
				>
					<h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
						{t('barchamediafayllar')}
					</h1>
				</motion.div>

				{loading ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='flex flex-col items-center justify-center py-12 gap-4'
					>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='text-muted-foreground'>
							{t('malumotlaryuklanmoqda')}
						</p>
					</motion.div>
				) : (
					<AnimatePresence mode='wait'>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='space-y-8'
						>
							<motion.div
								className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
								layout
							>
								{media.map((folder, index) => (
									<motion.div
										key={folder.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
									>
										<Link href={`/${language}/media/${folder.id}`}>
											<Card className='group h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm'>
												<CardHeader>
													<CardTitle className='flex items-center justify-between gap-4'>
														<span className='truncate text-lg'>
															{folder.name}
														</span>
														<motion.div
															whileHover={{ rotate: 15 }}
															transition={{ type: 'spring', stiffness: 300 }}
														>
															<FolderClosed className='h-6 w-6 text-primary transition-colors group-hover:text-primary/80' />
														</motion.div>
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className='text-sm text-muted-foreground'>
														{t('yaratilgansana')}:{' '}
														{new Date(folder.createdDate).toLocaleDateString(
															'uz-UZ'
														)}
													</p>
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								))}
							</motion.div>

							<div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-4'>
								<p className='text-sm text-muted-foreground'>
									{t('jami')}: {totalCount} {t('tapapka')}
								</p>

								<div className='flex items-center gap-2'>
									<Button
										variant='outline'
										size='icon'
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 0}
										className='h-8 w-8'
									>
										<ChevronLeft className='h-4 w-4' />
									</Button>

									<span className='text-sm min-w-[100px] text-center'>
										{currentPage + 1}-{t('sahifa')}
									</span>

									<Button
										variant='outline'
										size='icon'
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage >= totalPages - 1}
										className='h-8 w-8'
									>
										<ChevronRight className='h-4 w-4' />
									</Button>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</div>
	)
}

'use client'

import { getFolder, IFolderResult } from '@/lib/media'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderClosed, Loader2 } from 'lucide-react'
import Link from 'next/link'

function MediaPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [totalPages, setTotalPages] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [media, setMedia] = useState<IFolderResult[]>([])
	const [currentPage, setCurrentPage] = useState(0)

	useEffect(() => {
		fetchMediaFolder(currentPage)
	}, [currentPage])

	const fetchMediaFolder = async (pageNumber: number) => {
		try {
			setLoading(true)
			setError(null)
			const responseFolder = await getFolder({ pageSize: 20, pageNumber })

			if (responseFolder.isSuccess) {
				setMedia(responseFolder.result)
				setTotalPages(responseFolder.result.totalPages)
				setTotalCount(responseFolder.result.totalCount)
			} else {
				setError(
					responseFolder.errorMessages?.join(', ') || 'Failed to fetch folders'
				)
			}
		} catch (error) {
			setError('Failed to fetch folders')
			console.error('Error fetching folders:', error)
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
			},
		},
		hover: {
			scale: 1.02,
			transition: {
				type: 'spring',
				stiffness: 400,
				damping: 10,
			},
		},
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Media Gallery
				</motion.h1>

				{loading && (
					<motion.div
						className='flex justify-center items-center py-20'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<Loader2 className='h-12 w-12 animate-spin text-primary' />
					</motion.div>
				)}

				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
					>
						<Alert variant='destructive' className='mb-6'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					</motion.div>
				)}

				<AnimatePresence mode='wait'>
					{!loading && !error && (
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							className='space-y-8'
						>
							<motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{media.map(folder => (
									<motion.div
										key={folder.id}
										variants={cardVariants}
										whileHover='hover'
										layout
									>
										<Link
											href={`/uz/media/${folder.id}`}
											className='block h-full'
										>
											<Card className='h-full transform transition-all duration-300 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50'>
												<CardHeader>
													<CardTitle className='flex items-center justify-between gap-4'>
														<span className='truncate'>{folder.name}</span>
														<motion.div
															whileHover={{ rotate: 15 }}
															transition={{ type: 'spring', stiffness: 300 }}
														>
															<FolderClosed
																size={32}
																className='text-primary'
															/>
														</motion.div>
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className='text-muted-foreground text-sm'>
														Created:{' '}
														{new Date(folder.createdDate).toLocaleDateString()}
													</p>
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								))}
							</motion.div>

							<motion.div
								className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-8'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<Button
									variant='outline'
									disabled={currentPage === 0}
									onClick={() => handlePageChange(currentPage - 1)}
									className='w-full sm:w-auto'
								>
									Previous
								</Button>
								<span className='text-muted-foreground px-4'>
									Page {currentPage + 1} of {totalPages}
								</span>
								<Button
									disabled={currentPage >= totalPages - 1}
									onClick={() => handlePageChange(currentPage + 1)}
									className='w-full sm:w-auto'
								>
									Next
								</Button>
							</motion.div>

							<motion.p
								className='text-center text-muted-foreground'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
							>
								Total Folders: {totalCount}
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default MediaPage

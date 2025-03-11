'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMediaFiles, IFileResponse, IFileResult } from '@/lib/media'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Play } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function Page() {
	const [mediaFile, setMediaFile] = useState<IFileResult[]>([])
	const [loading, setLoading] = useState(true)
	const pathname = usePathname()
	const folderId = pathname.split('/')[3]

	useEffect(() => {
		fetchMediaFile()
	}, [folderId])

	const fetchMediaFile = async () => {
		setLoading(true)
		try {
			const mediaFileResponse: IFileResponse = await getMediaFiles({
				pageSize: 20,
				folderId: folderId,
				pageNumber: 0,
			})
			setMediaFile(mediaFileResponse.result)
		} finally {
			setLoading(false)
		}
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
			opacity: 0.95,
			transition: {
				type: 'spring',
				stiffness: 100,
			},
		},
		hover: {
			opacity: 1,
			scale: 1.02,
			transition: {
				type: 'spring',
				stiffness: 400,
				damping: 10,
			},
		},
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='container mx-auto'>
				<motion.h1
					className='text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Media Files
				</motion.h1>

				{loading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map(i => (
							<Card key={i} className='bg-card/50 backdrop-blur-sm'>
								<CardHeader>
									<Skeleton className='h-4 w-3/4' />
								</CardHeader>
								<CardContent>
									<Skeleton className='h-48 w-full' />
									<div className='mt-4'>
										<Skeleton className='h-4 w-1/2' />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<AnimatePresence>
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
						>
							{mediaFile.map(media => (
								<motion.div
									key={media.id}
									variants={cardVariants}
									whileHover='hover'
									layout
								>
									<Card className='bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 overflow-hidden'>
										<CardHeader className='space-y-2'>
											<CardTitle className='flex items-center gap-2 text-lg font-medium truncate'>
												<Play size={18} className='text-primary' />
												{media.fileName}
											</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4'>
											<div className='relative group'>
												<video
													className='w-full rounded-md aspect-video object-cover bg-muted'
													controls
													controlsList='nodownload'
													playsInline
													preload='metadata'
												>
													<source
														src={`http://213.230.109.74:8080/${media.filePath}`}
														type='video/mp4'
													/>
													Your browser does not support the video tag.
												</video>
												<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none'>
													<Play size={48} className='text-white' />
												</div>
											</div>
											<div className='flex items-center gap-2 text-sm text-muted-foreground'>
												<Calendar size={16} />
												<span>
													{new Date(media.uploadedDate).toLocaleDateString(
														'uz-UZ',
														{
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														}
													)}
												</span>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				)}

				{!loading && mediaFile.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center text-muted-foreground py-12'
					>
						No media files found in this folder.
					</motion.div>
				)}
			</div>
		</div>
	)
}

export default Page

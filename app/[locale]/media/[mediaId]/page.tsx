'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMediaFiles, IFileResponse, IFileResult } from '@/lib/media'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Play, Loader2, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function Page() {
	const [mediaFile, setMediaFile] = useState<IFileResult[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPlaying, setCurrentPlaying] = useState<string | null>(null)
	const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set())
	const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})

	const pathname = usePathname()
	const folderId = pathname.split('/')[3]
	const t = useTranslations('Media')

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	useEffect(() => {
		fetchMediaFile()
	}, [folderId])

	useEffect(() => {
		if (currentPlaying) {
			Object.keys(videoRefs.current).forEach(videoId => {
				if (videoId !== currentPlaying && videoRefs.current[videoId]) {
					videoRefs.current[videoId].pause()
				}
			})
		}
	}, [currentPlaying])

	const fetchMediaFile = async () => {
		setLoading(true)
		try {
			const mediaFileResponse: IFileResponse = await getMediaFiles({
				pageSize: 1000,
				folderId: folderId,
				pageNumber: 0,
			})
			setMediaFile(mediaFileResponse.result)
		} finally {
			setLoading(false)
		}
	}

	const handleVideoPlay = (videoId: string) => {
		setCurrentPlaying(videoId)
		setLoadedVideos(prev => new Set([...prev, videoId]))
	}

	const handleVideoPause = () => {
		setCurrentPlaying(null)
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
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
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
		<div className='min-h-screen bg-gradient-to-b from-sky-100/10 via-sky-300/30 to-sky-100/10 dark:from-sky-800/20  dark:via-sky-900/40   dark:to-sky-900/10 p-4 md:p-8'>
			<div className='container mx-auto'>
				<Button variant={'custom'}>
					<Link
						href={`${getLanguagePrefix()}/media`}
						className='flex items-center justify-center gap-2'
					>
						<ArrowLeft /> {t('ortga')}
					</Link>
				</Button>
				<motion.h1
					className='text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{t('mediafayllar')}
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
									<Card className='bg-card/50  backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 overflow-hidden'>
										<CardHeader className='space-y-2'>
											<CardTitle className='flex items-center gap-2 text-lg font-medium truncate'>
												<Play size={18} className='text-primary' />
												{media.fileName}
											</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4'>
											<div className='relative group aspect-video bg-muted rounded-md overflow-hidden'>
												{!loadedVideos.has(media.id) ? (
													<div className='absolute inset-0 flex items-center justify-center'>
														<Button
															variant='ghost'
															size='lg'
															className='w-16 h-16 rounded-full hover:scale-110 transition-transform'
															onClick={() => handleVideoPlay(media.id)}
														>
															<Play className='h-8 w-8 text-primary' />
														</Button>
													</div>
												) : (
													<video
														ref={el => {
															if (el) videoRefs.current[media.id] = el
														}}
														className='w-full h-full object-cover'
														controls
														controlsList='nodownload'
														playsInline
														onPlay={() => handleVideoPlay(media.id)}
														onPause={handleVideoPause}
													>
														<source
															src={`http://213.230.109.74:8080/${media.filePath}`}
															type='video/mp4'
														/>
														Your browser does not support the video tag.
													</video>
												)}

												{/* Loading Overlay */}
												<AnimatePresence>
													{loadedVideos.has(media.id) &&
														!videoRefs.current[media.id]?.readyState && (
															<motion.div
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																exit={{ opacity: 0 }}
																className='absolute inset-0 bg-black/40 flex items-center justify-center'
															>
																<Loader2 className='h-8 w-8 animate-spin text-white' />
															</motion.div>
														)}
												</AnimatePresence>
											</div>

											<div className='flex items-center justify-between text-sm text-muted-foreground'>
												<div className='flex items-center gap-2'>
													<Calendar size={16} />
													<span>
														{new Date(media.uploadedDate).toLocaleDateString(
															'uz-UZ'
														)}
													</span>
												</div>
												{currentPlaying === media.id && (
													<span className='text-primary animate-pulse'>
														Now Playing
													</span>
												)}
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

'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

// interface IRoadSignFolder {
// 	id: string
// 	name: string
// 	iconPath: string
// 	parentId?: string | null
// 	items: IRoadSignFolder[]
// 	parent?: IRoadSignFolder | null
// }
const Road_Sign = [
	{
		id: '1',
		name: 'Harakatlar 1.1',
		iconPath: '/success.png',
		parentId: null,
		items: [],
		parent: null,
	},
	{
		id: '2',
		name: "Yo'l belgilari",
		iconPath: '/success.png',
		parentId: null,
		items: [],
		parent: null,
	},
	{
		id: '3',
		name: 'Belgilar 1.1',
		iconPath: '/success.png',
		parentId: null,
		items: [],
		parent: null,
	},
	{
		id: '4',
		name: 'Belgilar 2.1',
		iconPath: '/success.png',
		parentId: null,
		items: [],
		parent: null,
	},
]

function RoadSignFolderPage() {
	const pathname = usePathname()

	const pathSegments = pathname.split('/')
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'
	return (
		<div className='min-h-screen bg-gradient-to-b from-sky-100/10 via-sky-300/30 to-sky-100/10 dark:from-sky-800/20  dark:via-sky-900/40   dark:to-sky-900/10 p-4 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				<Button variant={'custom'}>
					<Link
						href={`${getLanguagePrefix()}`}
						className='flex items-center justify-center gap-2'
					>
						<ArrowLeft /> ortga
					</Link>
				</Button>

				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center space-y-2'
				>
					<h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
						Yo&apos;l belgilari
					</h1>
				</motion.div>

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
							{Road_Sign.map((folder, index) => (
								<motion.div
									key={folder.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
								>
									<Link href={`/${language}/roadSigns/${folder.id}`}>
										<Card className='group h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm'>
											<CardHeader>
												<CardTitle className='flex items-center justify-center gap-4'>
													<span className='truncate text-lg '>
														{folder.name}
													</span>
													<motion.div
														whileHover={{ rotate: 15 }}
														transition={{ type: 'spring', stiffness: 300 }}
													></motion.div>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<Image
													src={folder.iconPath}
													alt={folder.name}
													width={400}
													height={400}
												/>

												<p className='text-sm text-end text-muted-foreground'>
													2025.04.08
												</p>
											</CardContent>
										</Card>
									</Link>
								</motion.div>
							))}
						</motion.div>

						{/* <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-4'>
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
							</div> */}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}

export default RoadSignFolderPage

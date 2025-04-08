'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

function Page() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loading, setLoading] = useState(false)
	const [selectedSign, setSelectedSign] = useState<{
		id: string
		name: string
		description: string
		IconPath: string
	} | null>(null)
	const pathname = usePathname()
	const t = useTranslations('Media')

	const roadSignDetails = [
		{
			id: '1',
			name: 'Yol belgisi 1',
			description:
				"Bu yo'l belgisi transport vositalarining tezligini cheklash uchun ishlatiladi. Maksimal ruxsat etilgan tezlik - 60 km/soat.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '2',
			name: 'Yol belgisi 2',
			description:
				"Bu yo'l belgisi piyodalar o'tish joyini bildiradi. Haydovchilar bu joyda ehtiyot bo'lishlari shart.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '3',
			name: "Yo'l belgisi 3",
			description:
				"Bu belgi yo'lda to'siq borligini anglatadi. Haydovchilar yo'lning boshqa qismidan o'tishlari kerak.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '4',
			name: 'Yol belgisi 4',
			description:
				"Bu belgi aylanma harakatni ko'rsatadi. Haydovchilar belgilangan yo'nalishda harakatlanishlari kerak.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '5',
			name: 'Yol belgisi 5',
			description:
				"Bu belgi yo'lning torayishini bildiradi. Haydovchilar tezlikni kamaytirishlari kerak.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '6',
			name: 'Yol belgisi 6',
			description:
				"Bu belgi yo'lning tik qiyaligini ko'rsatadi. Yuk tashuvchi transport vositalari uchun maxsus ogohlantirish.",
			IconPath: '/roadSign/roadsign1.png',
		},
		{
			id: '7',
			name: 'Yol belgisi 7',
			description:
				"Bu belgi yo'lning pastga qiyaligini bildiradi. Haydovchilar tormoz tizimini tekshirishlari tavsiya etiladi.",
			IconPath: '/roadSign/roadsign1.png',
		},
	]

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
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

	const imageVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
			},
		},
		hover: {
			scale: 1.05,
			transition: {
				type: 'spring',
				stiffness: 400,
				damping: 10,
			},
		},
	}

	const openDialog = (sign: {
		id: string
		name: string
		description: string
		IconPath: string
	}) => {
		setSelectedSign(sign)
	}

	const closeDialog = () => {
		setSelectedSign(null)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-sky-100/10 via-sky-300/30 to-sky-100/10 dark:from-sky-800/20  dark:via-sky-900/40   dark:to-sky-900/10 p-4 md:p-8'>
			<div className='container mx-auto'>
				<Button variant={'custom'}>
					<Link
						href={`${getLanguagePrefix()}/roadSigns`}
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
					Yol belgisi
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
							{roadSignDetails.map(sign => (
								<motion.div
									key={sign.id}
									variants={imageVariants}
									whileHover='hover'
									layout
									onClick={() => openDialog(sign)}
								>
									<Card className='bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 overflow-hidden cursor-pointer'>
										<CardHeader className='space-y-2'>
											<CardTitle className='flex items-center gap-2 text-lg font-medium truncate'>
												<ImageIcon size={18} className='text-primary' />
												{sign.name}
											</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4'>
											<div className='relative group aspect-video bg-muted rounded-md overflow-hidden'>
												<Image
													src={sign.IconPath}
													alt={sign.name}
													className='w-full h-full object-cover'
													width={500}
													height={300}
												/>
											</div>

											<div className='flex items-center justify-between text-sm text-muted-foreground'>
												<div className='flex items-center gap-2'>
													<Calendar size={16} />
													<span>2025-04-08</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				)}

				{/* Dialog for detailed view */}
				<Dialog open={!!selectedSign} onOpenChange={closeDialog}>
					{selectedSign && (
						<DialogContent className='sm:max-w-[625px] max-h-[90vh] overflow-y-auto'>
							<DialogHeader>
								<DialogTitle className='flex items-center gap-2'>
									<ImageIcon className='text-primary' />
									{selectedSign.name}
								</DialogTitle>
							</DialogHeader>
							<div className='grid gap-4 py-4'>
								<div className='relative aspect-video bg-muted rounded-md overflow-hidden'>
									<Image
										src={selectedSign.IconPath}
										alt={selectedSign.name}
										className='w-full h-full object-cover'
										width={200}
										height={200}
									/>
								</div>
								<div className='space-y-2'>
									<h3 className='font-semibold'>Tavsif:</h3>
									<p className='text-muted-foreground'>
										{selectedSign.description}
									</p>
								</div>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Calendar size={16} />
									<span>2025-04-08</span>
								</div>
							</div>
							<div className='flex justify-end'>
								<Button variant='outline' onClick={closeDialog}>
									Yopish
								</Button>
							</div>
						</DialogContent>
					)}
				</Dialog>
			</div>
		</div>
	)
}

export default Page

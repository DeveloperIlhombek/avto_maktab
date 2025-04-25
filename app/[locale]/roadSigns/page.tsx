'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function RoadSignFolderPage() {
	const pathname = usePathname()
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	const roadImages: string[] = [
		'1660292855_1.jpg',
		'1660292855_2.jpg',
		'1660292841_3.jpg',
		'1660292882_4.jpg',
		'1660292889_5.jpg',
		'1660292912_6.jpg',
		'1660292836_7.jpg',
		'1660292845_8.jpg',
		'1660292876_9.jpg',
		'1660292897_10.jpg',
		'1660292852_11.jpg',
		'1660292872_12.jpg',
		'1660292883_13.jpg',
		'1660292893_14.jpg',
		'1660292816_15.jpg',
		'1660292850_16.jpg',
	]

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
						className='space-y-0'
					>
						{roadImages.map((imageUrl, index) => (
							<div key={index} className='flex justify-center p-0 m-0'>
								<Image
									src={`/road/${imageUrl}`}
									alt={imageUrl}
									width={1000}
									height={500}
								/>
							</div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}

export default RoadSignFolderPage

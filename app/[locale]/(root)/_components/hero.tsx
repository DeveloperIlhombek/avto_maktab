'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { LoginDialog } from './loginDialog'

export default function Home() {
	const t = useTranslations('Hero')

	return (
		<div className='mt-16 min-h-[75vh] bg-background flex items-center'>
			<div className='mx-auto'>
				<motion.div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
					<div className='space-y-6 ml-8'>
						<motion.h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
							{t('emaktab')}
						</motion.h1>
						<motion.p className='text-lg md:text-xl text-muted-foreground max-w-[600px]'>
							{t('emaktabdescription')}
						</motion.p>
						<LoginDialog
							trigger={
								<Button variant='custom' size='lg' className='text-lg px-8'>
									{t('tizimgakirish')}
								</Button>
							}
						/>
					</div>
					<motion.div
						//variants={item}
						className='relative h-[300px] md:h-[500px]'
					>
						<motion.img
							src='driver.avif'
							alt='Driving School'
							className='rounded-lg object-cover w-full h-full'
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 rounded-lg' />
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}

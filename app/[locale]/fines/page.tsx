'use client'
import React from 'react'
import { allFines } from './constant'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
function FinesPage() {
	const pathname = usePathname()
	const t = useTranslations('Media')
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	return (
		<div className='mx-auto py-10 px-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-6xl mx-auto'
			>
				<Button variant={'custom'}>
					<Link
						href={`${getLanguagePrefix()}`}
						className='flex items-center justify-center gap-2'
					>
						<ArrowLeft /> {t('ortga')}
					</Link>
				</Button>
				<h1 className='text-3xl text-center font-semibold mb-4 mt-4 pb-6'>
					Jarimalar
				</h1>
				<Card className='overflow border shadow-md'>
					{allFines.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow className='border-y-2 border-border bg-muted/50'>
									<TableHead className='w-[180px] text-center font-bold text-foreground border-r'>
										Huquqbuzarlik turi
									</TableHead>
									<TableHead className='font-bold text-center text-foreground border-r'>
										Ma&apos;muriy kodeks moddasi
									</TableHead>
									<TableHead className='font-bold text-center text-foreground border-r'>
										Jarima miqdori
									</TableHead>
									<TableHead className='w-[80px] text-center font-bold text-foreground'>
										BHM dan
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{allFines.map((fine, index) => (
									<TableRow
										key={index}
										className='hover:bg-muted/30 transition-colors duration-200 border-b'
									>
										<TableCell className='font-medium border-r'>
											{fine.article}
										</TableCell>
										<TableCell className='border-r'>
											{fine.description}
										</TableCell>
										<TableCell className='border-r'>
											{fine.fine_amount}
										</TableCell>
										<TableCell className='text-right'>{fine.bhm}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className='p-8 text-center text-muted-foreground'>
							Jarimalar mavjud emas
						</div>
					)}
				</Card>
			</motion.div>
		</div>
	)
}

export default FinesPage

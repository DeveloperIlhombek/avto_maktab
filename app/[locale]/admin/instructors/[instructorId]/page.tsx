'use client'

import { deleteUser, getUserById, UserData } from '@/lib/users'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, User, Shield, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
function Page() {
	const pathname = usePathname()
	const [fetchInstructor, setFetchInstructor] = useState<UserData>()
	const [loading, setLoading] = useState(true)
	const Id = pathname.split('/')[4]
	const router = useRouter()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'
	const user_id = pathname.split('/')[4]
	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}
	useEffect(() => {
		const fetchInstructorData = async () => {
			try {
				setLoading(true)
				const response = await getUserById(Id)
				setFetchInstructor(response.result)
			} catch (error) {
				toast.error(`Xatolik: ${error}`)
			} finally {
				setLoading(false)
			}
		}
		fetchInstructorData()
	}, [Id])

	const handleDelete = async () => {
		try {
			const response = await deleteUser(user_id as string)
			if (response.isSuccess) {
				toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi")
				router.push(`${getLanguagePrefix()}/admin/instructors`)
			} else {
				toast.error(
					response.errorMessages?.join(', ') ||
						"Foydalanuvchini o'chirishda xatolik yuz berdi"
				)
			}
		} catch (error) {
			toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi")
			console.error('Error deleting user:', error)
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
				<div className='max-w-4xl mx-auto'>
					<Card className='border-2'>
						<CardContent className='p-8'>
							<div className='space-y-4'>
								<div className='h-8 w-48 bg-muted animate-pulse rounded' />
								<div className='h-24 w-full bg-muted animate-pulse rounded' />
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{[1, 2, 3, 4].map(i => (
										<div
											key={i}
											className='h-16 bg-muted animate-pulse rounded'
										/>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	if (!fetchInstructor) {
		return null
	}

	const InfoItem = ({
		icon: Icon,
		label,
		value,
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any
		label: string
		value: string
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50'
		>
			<div className='p-2 rounded-full bg-primary/10'>
				<Icon className='h-5 w-5 text-primary' />
			</div>
			<div>
				<p className='text-sm text-muted-foreground'>{label}</p>
				<p className='font-medium'>{value}</p>
			</div>
		</motion.div>
	)

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
			<div className='max-w-4xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-8'
				>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
								Instruktor ma&apos;lumotlari
							</h1>
							<p className='text-muted-foreground'>
								Instruktor haqida batafsil ma&apos;lumot
							</p>
						</div>
						<div className='flex items-center justify-center gap-4'>
							<Link
								href={`${getLanguagePrefix()}/admin/instructors/${user_id}/edit`}
							>
								<Button variant='outline' className='gap-2'>
									<Pencil className='h-4 w-4' />
									Tahrirlash
								</Button>
							</Link>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant='destructive' className='gap-2'>
										<Trash2 className='h-4 w-4' />
										O&apos;chirish
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Foydalanuvchini o&apos;chirishni tasdiqlaysizmi?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Bu amalni qaytarib bo&apos;lmaydi. Foydalanuvchi va unga
											tegishli barcha ma&apos;lumotlar butunlay
											o&apos;chiriladi.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Bekor qilish</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDelete}
											className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
										>
											O&apos;chirish
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				</motion.div>

				<Card className='border-2'>
					<CardHeader>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className='flex items-center gap-6'
						>
							<Avatar className='h-24 w-24 ring-2 ring-primary/20 ring-offset-2'>
								<AvatarFallback className='text-3xl bg-primary/10'>
									{fetchInstructor.name[0]}
									{fetchInstructor.surname[0]}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className='text-2xl'>
									{fetchInstructor.name} {fetchInstructor.surname}
								</CardTitle>
								<p className='text-muted-foreground mt-1'>
									@{fetchInstructor.username}
								</p>
								<Badge variant='secondary' className='mt-2'>
									{fetchInstructor.role === 2 ? 'Instruktor' : 'Foydalanuvchi'}
								</Badge>
							</div>
						</motion.div>
					</CardHeader>
					<CardContent>
						<motion.div
							initial='hidden'
							animate='show'
							variants={{
								hidden: { opacity: 0 },
								show: {
									opacity: 1,
									transition: {
										staggerChildren: 0.1,
									},
								},
							}}
							className='grid grid-cols-1 md:grid-cols-2 gap-4'
						>
							<InfoItem icon={User} label='Ism' value={fetchInstructor.name} />
							<InfoItem
								icon={Mail}
								label='Email'
								value={fetchInstructor.email}
							/>
							<InfoItem
								icon={Phone}
								label='Telefon'
								value={fetchInstructor.phone}
							/>
							<InfoItem
								icon={Shield}
								label='Role'
								value={
									fetchInstructor.role === 2 ? 'Instruktor' : 'Foydalanuvchi'
								}
							/>
						</motion.div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default Page

'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { getGroupById } from '@/lib/groups'
import type { GroupItem } from '@/lib/groups'

export default function GroupDetails() {
	const router = useRouter()
	const [group, setGroup] = useState<GroupItem | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()
	const id = pathname.split('/')[4]

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	useEffect(() => {
		const fetchGroup = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getGroupById(id)

				if (response.isSuccess) {
					setGroup(response.result)
				} else {
					setError(
						response.errorMessages?.join(', ') ||
							"Guruh ma'lumotlarini yuklashda xatolik"
					)
				}
			} catch (error) {
				console.error('Error fetching group:', error)
				setError("Guruh ma'lumotlarini yuklashda xatolik yuz berdi")
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchGroup()
		}
	}, [id])

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='flex flex-col items-center gap-2'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
					<p className='text-muted-foreground'>
						Guruh ma&apos;lumotlari yuklanmoqda...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-destructive'>
						Xatolik yuz berdi
					</h2>
					<p className='text-muted-foreground mt-2'>{error}</p>
					<Button
						variant='outline'
						className='mt-4'
						onClick={() => router.push(`${getLanguagePrefix()}/admin/groups`)}
					>
						Orqaga qaytish
					</Button>
				</div>
			</div>
		)
	}

	if (!group) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold'>Guruh topilmadi</h2>
					<Button
						variant='outline'
						className='mt-4'
						onClick={() => router.push(`${getLanguagePrefix()}/admin/groups`)}
					>
						Orqaga qaytish
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/groups`}>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Guruh ma&apos;lumotlari
					</h2>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Asosiy ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Guruh nomi
							</h3>
							<p className='mt-1 text-lg'>{group.name}</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Izoh
							</h3>
							<p className='mt-1 text-lg'>{group.description}</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								O&apos;qituvchi ID
							</h3>
							<p className='mt-1 text-lg'>{group.instructorId}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Qo&apos;shimcha ma&apos;lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Yaratilgan sana
							</h3>
							<p className='mt-1 text-lg'>
								{new Date(group.createdDate).toLocaleDateString()}
							</p>
						</div>
						<div>
							<h3 className='font-medium text-sm text-muted-foreground'>
								Holati
							</h3>
							<p className='mt-1 text-lg'>
								{group.isActive ? 'Faol' : 'Faol emas'}
							</p>
						</div>
						{group.deletedDate && (
							<div>
								<h3 className='font-medium text-sm text-muted-foreground'>
									O&apos;chirilgan sana{' '}
								</h3>
								<p className='mt-1 text-lg'>
									{new Date(group.deletedDate).toLocaleDateString()}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

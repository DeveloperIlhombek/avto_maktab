'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabIcons } from './_components/tab-icons'
import { OverviewTab } from './_components/overview-tab'
import { EducationTab } from './_components/education-tab'
import { TestsTab } from './_components/tests-tab'
import { PaymentsTab } from './_components/payments-tab'
import { PracticeTab } from './_components/practice-tab'
import { usePathname, useRouter } from 'next/navigation'
import { ProfileCard } from './_components/profile-card'
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
import { toast } from 'sonner'
import { deleteUser } from '@/lib/users'

export default function StudentDetails() {
	const [activeTab, setActiveTab] = useState('overview')
	const router = useRouter()
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'
	const user_id = pathname.split('/')[4]
	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}

	const handleDelete = async () => {
		try {
			const response = await deleteUser(user_id as string)
			if (response.isSuccess) {
				toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi")
				router.push(`${getLanguagePrefix()}/admin/students`)
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

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`${getLanguagePrefix()}/admin/students`}>
						<Button variant='custom' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						O&apos;quvchi ma&apos;lumotlari
					</h2>
				</div>
				<div className='flex gap-2'>
					<Link href={`${getLanguagePrefix()}/admin/students/${user_id}/edit`}>
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
									tegishli barcha ma&apos;lumotlar butunlay o&apos;chiriladi.
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

			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<ProfileCard key={user_id} />
				<div className='md:col-span-3 space-y-6'>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							{TabIcons.map(tab => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className='gap-2'
								>
									<tab.icon className='h-4 w-4' />
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value='overview'>
							<OverviewTab userId={user_id as string} />
						</TabsContent>

						<TabsContent value='education'>
							<EducationTab />
						</TabsContent>

						<TabsContent value='tests'>
							<TestsTab />
						</TabsContent>

						<TabsContent value='payments'>
							<PaymentsTab />
						</TabsContent>

						<TabsContent value='practice'>
							<PracticeTab />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}

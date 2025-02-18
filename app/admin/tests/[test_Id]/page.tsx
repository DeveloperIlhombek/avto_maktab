'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

// Mock data for a single question
const questionData = {
	id: 1,
	question:
		"Qaysi avtomobil uchun bu belgilarning ta'sir oralig'ida to'xtashga ruxsat etiladi?",
	choises: [
		{ text: 'Qizilga', answer: false },
		{ text: 'Ikkala avtomobilga', answer: false },
		{ text: 'Hech qaysi biriga', answer: false },
		{
			text: "<<Nogiron>> taniqlik belgisi bo'lgan sariq avtomobilga",
			answer: true,
		},
	],
	media: { exist: true, name: '1' },
	description:
		"YHQ 1-ilovasi 3-bo'limi 2-xatboshiga asosan, qoidalarning 174-bandiga ko'ra «Nogiron» taniqlik belgisi o'rnatilgan avtomobil va motokolyaskalarni boshqarayotgan nogiron haydovchilar 3.2, 3.3 va 3.28 belgilari talablaridan chetga chiqishlari mumkin. 7.18 qo'shimcha belgisi bo'lganda 3.27 belgisining ta'sir oralig'ida to'xtashga ruxsat etiladi.",
	category: 'B',
	createdAt: '2024-03-15',
	status: 'Faol',
}

export default function QuestionDetails() {
	const { id } = useParams()
	const router = useRouter()

	const handleDelete = async () => {
		try {
			// Add your delete logic here
			// await deleteQuestion(id)
			router.push('/admin/tests')
		} catch (error) {
			console.error('Error deleting question:', error)
		}
	}

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'faol':
				return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
			case 'nofaol':
				return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
			default:
				return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/tests'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						Savol ma&apos;lumotlari
					</h2>
				</div>
				<div className='flex gap-2'>
					<Link href={`/admin/tests/${id}/edit`}>
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
									Savolni o&apos;chirishni tasdiqlaysizmi?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Bu amalni qaytarib bo&apos;lmaydi. Savol va unga tegishli
									barcha ma&apos;lumotlar butunlay o&apos;chiriladi.
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

			<div className='grid grid-cols-1 gap-6'>
				{/* Question Info Card */}
				<Card>
					<CardHeader>
						<CardTitle>Savol ma&apos;lumotlari</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Savol matni</p>
							<p className='font-medium'>{questionData.question}</p>
						</div>

						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Toifa</p>
							<Badge variant='secondary'>{questionData.category}</Badge>
						</div>

						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Status</p>
							<Badge className={getStatusColor(questionData.status)}>
								{questionData.status}
							</Badge>
						</div>

						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Yaratilgan sana</p>
							<p className='font-medium'>{questionData.createdAt}</p>
						</div>

						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground'>Savol izohi</p>
							<p className='text-sm'>{questionData.description}</p>
						</div>

						<div className='space-y-2'>
							<p className='text-sm text-muted-foreground'>Javob variantlari</p>
							<div className='space-y-2'>
								{questionData.choises.map((choice, index) => (
									<div
										key={index}
										className={`p-3 rounded-lg ${
											choice.answer
												? 'bg-green-500/10 border border-green-500/20'
												: 'bg-gray-100'
										}`}
									>
										<p className={`${choice.answer ? 'text-green-600' : ''}`}>
											{choice.text}
											{choice.answer && "(To'g'ri javob)"}
										</p>
									</div>
								))}
							</div>
						</div>

						{questionData.media.exist && (
							<div className='space-y-2'>
								<p className='text-sm text-muted-foreground'>Rasm</p>
								<div className='rounded-lg overflow-hidden border'>
									<Image
										src={`/car.png`}
										alt='Question illustration'
										width={500}
										height={500}
										className='w-full h-auto'
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

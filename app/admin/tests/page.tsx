'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react'

// Mock data for questions
const questions = [
	{
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
	},
	// Add more mock questions as needed
]

export default function QuestionsPage() {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredQuestions = questions.filter(question =>
		question.question.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Savollar</h2>
					<p className='text-muted-foreground'>
						Barcha test savollari ro&apos;yxati va boshqaruvi
					</p>
				</div>
				<Link href='/admin/tests/newtest'>
					<Button className='gap-2'>
						<Plus className='h-4 w-4' />
						Yangi savol
					</Button>
				</Link>
			</div>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4 flex-1'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Savol qidirish...'
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Savollar ro&apos;yxati</CardTitle>
					<CardDescription>
						Jami {filteredQuestions.length} ta savol
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[400px]'>Savol</TableHead>

								<TableHead className='text-right'>Amallar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredQuestions.map(question => (
								<TableRow key={question.id} className='group'>
									<TableCell className='font-medium'>
										{question.question}
									</TableCell>

									<TableCell className='text-right'>
										<div className='flex justify-end gap-2 opacity-100 '>
											<Link href={`/admin/tests/${question.id}`}>
												<Button variant='ghost' size='icon' className='h-8 w-8'>
													<Eye className='h-4 w-4' />
												</Button>
											</Link>
											<Link href={`/admin/tests/${question.id}/edit`}>
												<Button variant='ghost' size='icon' className='h-8 w-8'>
													<Pencil className='h-4 w-4' />
												</Button>
											</Link>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 text-destructive'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

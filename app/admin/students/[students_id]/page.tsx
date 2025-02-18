'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	ArrowLeft,
	User,
	GraduationCap,
	ClipboardCheck,
	Wallet,
	Car,
} from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { studentData } from '@/constanta'
//import { IStudent } from '@/types'

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'UZS',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount)
}

export default function StudentDetails() {
	// const { id } = useParams()
	const [activeTab, setActiveTab] = useState('overview')

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/students'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h2 className='text-3xl font-bold tracking-tight'>
						O&apos;quvchi ma&apos;lumotlari
					</h2>
				</div>
				<Button>Tahrirlash</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				{/* Student Profile Card */}
				<Card className='md:col-span-1'>
					<CardContent className='pt-6'>
						<div className='flex flex-col items-center text-center'>
							<Avatar className='h-24 w-24 mb-4'>
								<AvatarFallback className='text-2xl'>
									{studentData.name
										.split(' ')
										.map(n => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<h3 className='text-xl font-semibold'>{studentData.name}</h3>
							<p className='text-sm text-muted-foreground mb-4'>
								{studentData.email}
							</p>
							<Badge variant='secondary' className='mb-6'>
								{studentData.category} toifa
							</Badge>
							<div className='w-full space-y-2'>
								<div className='flex justify-between text-sm'>
									<span className='text-muted-foreground'>Progress</span>
									<span className='font-medium'>{studentData.progress}%</span>
								</div>
								<div className='w-full h-2 rounded-full bg-secondary'>
									<div
										className='h-full bg-primary rounded-full'
										style={{ width: `${studentData.progress}%` }}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				<div className='md:col-span-3 space-y-6'>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value='overview' className='gap-2'>
								<User className='h-4 w-4' />
								Umumiy
							</TabsTrigger>
							<TabsTrigger value='education' className='gap-2'>
								<GraduationCap className='h-4 w-4' />
								Ta&apos;lim
							</TabsTrigger>
							<TabsTrigger value='tests' className='gap-2'>
								<ClipboardCheck className='h-4 w-4' />
								Testlar
							</TabsTrigger>
							<TabsTrigger value='payments' className='gap-2'>
								<Wallet className='h-4 w-4' />
								To&apos;lovlar
							</TabsTrigger>
							<TabsTrigger value='practice' className='gap-2'>
								<Car className='h-4 w-4' />
								Amaliyot
							</TabsTrigger>
						</TabsList>

						<TabsContent value='overview' className='space-y-4'>
							<Card>
								<CardHeader>
									<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
								</CardHeader>
								<CardContent className='grid grid-cols-2 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground'>Telefon</p>
										<p className='font-medium'>{studentData.phone}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>Manzil</p>
										<p className='font-medium'>{studentData.address}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											Tug&apos;ilgan sana
										</p>
										<p className='font-medium'>
											{new Date(studentData.birthDate).toLocaleDateString(
												'uz-UZ'
											)}
										</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											Ro&apos;yxatdan o&apos;tgan sana
										</p>
										<p className='font-medium'>
											{new Date(
												studentData.registrationDate
											).toLocaleDateString('en-US')}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>To&apos;lov ma&apos;lumotlari</CardTitle>
								</CardHeader>
								<CardContent className='grid grid-cols-3 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Umumiy to&apos;lov
										</p>
										<p className='font-medium'>
											{formatCurrency(studentData.totalPayment)}
										</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>
											To&apos;langan
										</p>
										<p className='font-medium'>
											{formatCurrency(studentData.paidAmount)}
										</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground'>Qolgan</p>
										<p className='font-medium'>
											{formatCurrency(studentData.remainingAmount)}
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='education'>
							<Card>
								<CardHeader>
									<CardTitle>Ta&apos;lim ma&apos;lumotlari</CardTitle>
									<CardDescription>
										O&apos;quvchining o&apos;quv jarayoni haqida ma&apos;lumot
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<p className='text-sm text-muted-foreground'>
													Instruktor
												</p>
												<p className='font-medium'>{studentData.instructor}</p>
											</div>
											<div>
												<p className='text-sm text-muted-foreground'>Toifa</p>
												<p className='font-medium'>{studentData.category}</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='tests'>
							<Card>
								<CardHeader>
									<CardTitle>Test natijalari</CardTitle>
									<CardDescription>
										O&apos;quvchining test sinovlari natijalari
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Sana</TableHead>
												<TableHead>Ball</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{studentData.testResults.map((test, index) => (
												<TableRow key={index}>
													<TableCell>
														{new Date(test.date).toLocaleDateString('uz-UZ')}
													</TableCell>
													<TableCell>
														{test.score}/{test.total}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																test.status === "O'tdi"
																	? 'secondary'
																	: 'destructive'
															}
														>
															{test.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='payments'>
							<Card>
								<CardHeader>
									<CardTitle>To&apos;lovlar tarixi</CardTitle>
									<CardDescription>
										O&apos;quvchining to&apos;lovlar tarixi
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Sana</TableHead>
												<TableHead>Summa</TableHead>
												<TableHead>To&apos;lov turi</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{studentData.payments.map((payment, index) => (
												<TableRow key={index}>
													<TableCell>
														{new Date(payment.date).toLocaleDateString('uz-UZ')}
													</TableCell>
													<TableCell>
														{formatCurrency(payment.amount)}
													</TableCell>
													<TableCell>{payment.type}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='practice'>
							<Card>
								<CardHeader>
									<CardTitle>Amaliy mashg&apos;ulotlar</CardTitle>
									<CardDescription>
										O&apos;quvchining amaliy mashg&apos; ulotlari
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Sana</TableHead>
												<TableHead>Mavzu</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{studentData.practicalLessons.map((lesson, index) => (
												<TableRow key={index}>
													<TableCell>
														{new Date(lesson.date).toLocaleDateString('uz-UZ')}
													</TableCell>
													<TableCell>{lesson.topic}</TableCell>
													<TableCell>
														<Badge
															variant={
																lesson.status === 'Bajarildi'
																	? 'secondary'
																	: 'destructive'
															}
														>
															{lesson.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}

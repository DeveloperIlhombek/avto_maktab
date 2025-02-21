'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getUserById } from '@/lib/api'

// Mock student data
const studentData = {
	id: 'ST123456',
	name: 'Aziz Rahimov',
	email: 'aziz@gmail.com',
	phone: '+998 90 123 45 67',
	address: 'Samarqand shahar Bulungur tumani',
	birthDate: '1995-05-15',
	group: 'B-123',
	category: 'B',
	registrationDate: '2024-02-15',
	instructor: 'Akmal Karimov',
	status: 'Faol',
}

export default function StudentProfile() {
	const [isEditing, setIsEditing] = useState(false)
	// const [user, setUser] = useState(null)

	// useEffect(() => {
	// 	const fetchUser = async () => {
	// 		const data = await getUserById()
	// 		if (data) {
	// 			setUser(data)
	// 		}
	// 	}

	// 	fetchUser()
	// }, [])

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Profil</h2>
					<p className='text-muted-foreground'>
						Shaxsiy ma&apos;lumotlaringizni ko&apos;ring va tahrirlang
					</p>
				</div>
				<Button
					onClick={() => setIsEditing(!isEditing)}
					variant={isEditing ? 'destructive' : 'default'}
				>
					{isEditing ? 'Bekor qilish' : 'Tahrirlash'}
				</Button>
			</div>

			<Tabs defaultValue='personal' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='personal'>Shaxsiy ma&apos;lumotlar</TabsTrigger>
					<TabsTrigger value='education'>
						O&apos;quv ma&apos;lumotlari
					</TabsTrigger>
					<TabsTrigger value='security'>Xavfsizlik</TabsTrigger>
				</TabsList>

				<TabsContent value='personal' className='space-y-4'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-4'>
								<Avatar className='h-20 w-20'>
									<AvatarFallback className='text-2xl'>
										{studentData.name
											.split(' ')
											.map(n => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>{}</CardTitle>
									<CardDescription>ID: {studentData.id}</CardDescription>
									<Badge variant='secondary' className='mt-1'>
										{studentData.category} toifa
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>To&apos;liq ism</Label>
									<Input
										id='name'
										defaultValue={studentData.name}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										defaultValue={studentData.email}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Telefon</Label>
									<Input
										id='phone'
										defaultValue={studentData.phone}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='address'>Manzil</Label>
									<Input
										id='address'
										defaultValue={studentData.address}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='birthDate'>Tug&apos;ilgan sana</Label>
									<Input
										id='birthDate'
										type='date'
										defaultValue={studentData.birthDate}
										disabled={!isEditing}
									/>
								</div>
							</div>
							{isEditing && (
								<div className='flex justify-end'>
									<Button>Saqlash</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='education'>
					<Card>
						<CardHeader>
							<CardTitle>O&apos;quv ma&apos;lumotlari</CardTitle>
							<CardDescription>
								O&apos;quv jarayoni bilan bog&apos;liq ma&apos;lumotlar
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-1'>
									<Label>Guruh</Label>
									<p className='font-medium'>{studentData.group}</p>
								</div>
								<div className='space-y-1'>
									<Label>Toifa</Label>
									<p className='font-medium'>{studentData.category}</p>
								</div>
								<div className='space-y-1'>
									<Label>Ro&apos;yxatdan o&apos;tgan sana</Label>
									<p className='font-medium'>
										{new Date(studentData.registrationDate).toLocaleDateString(
											'uz-UZ'
										)}
									</p>
								</div>
								<div className='space-y-1'>
									<Label>Instruktor</Label>
									<p className='font-medium'>{studentData.instructor}</p>
								</div>
								<div className='space-y-1'>
									<Label>Status</Label>
									<Badge variant='secondary'>{studentData.status}</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='security'>
					<Card>
						<CardHeader>
							<CardTitle>Xavfsizlik</CardTitle>
							<CardDescription>Parolingizni o&apos;zgartirish</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='currentPassword'>Joriy parol</Label>
									<Input id='currentPassword' type='password' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>Yangi parol</Label>
									<Input id='newPassword' type='password' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>
										Yangi parolni tasdiqlang
									</Label>
									<Input id='confirmPassword' type='password' />
								</div>
								<Button>Parolni o&apos;zgartirish</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

// Response body
// Download
// {
//   "isSuccess": true,
//   "result": {
//     "id": "08dd50b3-6767-48d7-87e9-5fa06850ab7a",
//     "name": "Ilhom",
//     "surname": "Toshqulov",
//     "username": "talaba",
//     "email": "ilxomdeveloper@gmail.com",
//     "phone": "+998771232115",
//     "role": "student"
//   },
//   "statusCode": 200,
//   "errorMessages": []
// }

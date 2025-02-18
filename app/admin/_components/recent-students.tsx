'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const students = [
	{
		name: 'Aziz Rahimov',
		email: 'aziz@gmail.com',
		status: 'Faol',
		progress: 75,
	},
	{
		name: 'Malika Karimova',
		email: 'malika@gmail.com',
		status: 'Faol',
		progress: 85,
	},
	{
		name: 'Jamshid Aliyev',
		email: 'jamshid@gmail.com',
		status: 'Faol',
		progress: 65,
	},
	{
		name: 'Nilufar Saidova',
		email: 'nilufar@gmail.com',
		status: 'Faol',
		progress: 90,
	},
	{
		name: 'Bobur Umarov',
		email: 'bobur@gmail.com',
		status: 'Faol',
		progress: 70,
	},
]

export function RecentStudents() {
	return (
		<div className='space-y-8'>
			{students.map((student, index) => (
				<div key={index} className='flex items-center'>
					<Avatar className='h-9 w-9'>
						<AvatarFallback>
							{student.name
								.split(' ')
								.map(n => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div className='ml-4 space-y-1'>
						<p className='text-sm font-medium leading-none'>{student.name}</p>
						<p className='text-sm text-muted-foreground'>{student.email}</p>
					</div>
					<div className='ml-auto text-sm'>
						<div className='flex items-center'>
							<div className='ml-2 w-16 h-2 rounded-full bg-secondary overflow-hidden'>
								<div
									className='h-full bg-primary rounded-full'
									style={{ width: `${student.progress}%` }}
								/>
							</div>
							<span className='ml-2 text-muted-foreground'>
								{student.progress}%
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { studentData } from '@/constanta'

export function EducationTab() {
	return (
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
							<p className='text-sm text-muted-foreground'>Instruktor</p>
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
	)
}

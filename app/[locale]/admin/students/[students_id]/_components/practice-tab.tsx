import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { studentData } from '@/constanta'

export function PracticeTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Amaliy mashg&apos;ulotlar</CardTitle>
				<CardDescription>
					O&apos;quvchining amaliy mashg&apos;ulotlari
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
	)
}

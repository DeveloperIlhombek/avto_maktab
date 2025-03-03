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

export function TestsTab() {
	return (
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
											test.status === "O'tdi" ? 'secondary' : 'destructive'
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
	)
}

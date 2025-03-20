import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function PaymentsTab() {
	return (
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
					{/* <TableBody>
						{studentData.payments.map((payment, index) => (
							<TableRow key={index}>
								<TableCell>
									{new Date(payment.date).toLocaleDateString('uz-UZ')}
								</TableCell>
								<TableCell>{formatCurrency(payment.amount)}</TableCell>
								<TableCell>{payment.type}</TableCell>
							</TableRow>
						))}
					</TableBody> */}
				</Table>
			</CardContent>
		</Card>
	)
}

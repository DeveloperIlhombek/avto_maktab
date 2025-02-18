import { ReactNode } from 'react'

export interface ChildProps {
	children: ReactNode
}

export interface IStudent {
	id: number
	name: string
	email: string
	phone: string
	address: string
	birthData: string
	category: string
	instructor: string
	totolPayment: number
	piadAmount: number
	remainamount: number
	progress: number
	status: string
	testResult: TestStudentResult[]
	practiceresult: PracticeStudentResult[]
	PaymentHistory: PaymentHistory[]
}
export interface TestStudentResult {
	id: number
	data: string
	score: number
	total: number
}
export interface PracticeStudentResult {
	id: number
	data: string
	topic: string
	status: string
}
export interface PaymentHistory {
	id: number
	data: string
	amount: number
	type: string
}

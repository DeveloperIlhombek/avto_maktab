/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'
//const API_URL = 'https://9284dgg8-5000.euw.devtunnels.ms'

export interface TestsResponse {
	isSuccess: boolean
	result: {
		items: Test[]
		pageNumber: number
		pageSize: number
		totalCount: number
		totalPages: number
	}
	statusCode: number
	errorMessages: string[]
}

export interface Test {
	id: string
	name: string | null
	question: string
	explanation: string
	mediaUrl: string | null
	testAnswers: TestAnswer[]
	testAnswersForUser: any[] | null
}

export interface TestAnswer {
	id: string
	testCaseId: string
	answerTextUZ: string
	answerTextUZK: string
	answerTextRU: string
	isCorrect: boolean
}

interface TestAnswerCreate {
	answerTextUZ: string
	answerTextUZK: string
	answerTextRU: string
	isCorrect: boolean
}

interface CreateTestData {
	QuestionUZ: string
	QuestionUZK: string
	QuestionRU: string
	ExplanationUZ: string
	ExplanationUZK: string
	ExplanationRU: string
	Media?: File
	Answers: TestAnswerCreate[]
}

interface ApiResponse {
	isSuccess: boolean
	errorMessages?: string[]
	result?: any
}

export async function createTest(data: CreateTestData): Promise<ApiResponse> {
	try {
		const formData = new FormData()
		formData.append('QuestionUZ', data.QuestionUZ)
		formData.append('QuestionUZK', data.QuestionUZK)
		formData.append('QuestionRU', data.QuestionRU)
		formData.append('ExplanationUZ', data.ExplanationUZ)
		formData.append('ExplanationUZK', data.ExplanationUZK)
		formData.append('ExplanationRU', data.ExplanationRU)
		formData.append('answersJson', JSON.stringify(data.Answers))

		if (data.Media) {
			formData.append('Media', data.Media)
		}

		const response = await fetch(`${API_URL}/api/TestCase/Create?language=uz`, {
			method: 'POST',
			headers: {
				Authorization:
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDVoZXZnZXR5cnRyMDk4YmI4cmViZXJid3I0dnZiODk0NSIsImp0aSI6IjYxY2U0ZmJmLWQyMGItNGVkZC05NTNmLWQxYTdlY2YwNzJjMiIsImlhdCI6IjE3NDE3NjA5MDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMwZmQ0YmJmLTQzZGUtNDRmMi1hZWMzLTE5ODE1YTE5MzdlYyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQxODQ3MzAxLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvIn0.b94wuoRKYtviS09ka94piqSpTSCEGqTpYI4z96MScuA',
			},
			body: formData,
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.errorMessages?.join(', ') || 'Failed to create test'
			)
		}

		return await response.json()
	} catch (error) {
		console.error('Error creating test:', error)
		throw error
	}
}

//Barcha testlarni olish test uchun user test ishlash uchun
export const getAllTests = async ({
	pageSize,
	pageNumber,
	language,
}: {
	pageSize: number
	pageNumber: number
	language: string
}) => {
	try {
		const response = await fetch(
			`${API_URL}/api/UserTest/GetQuestions?language=${language}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			{
				method: 'GET',
				headers: {
					Accept: '*/*',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		//console.log(data)

		return data.result
	} catch (error) {
		console.error('Error fetching tests:', error)
		return null
	}
}

//barcha testlarni ko'rish admin uchun
export const getAllTestsAdmin = async (
	pageNumber: number = 0,
	pageSize: number = 10,
	language: string = 'uz'
): Promise<TestsResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/GetAll?IsAdmin=true&language=${language}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDVoZXZnZXR5cnRyMDk4YmI4cmViZXJid3I0dnZiODk0NSIsImp0aSI6IjBhNjBjMDViLTZlYTYtNDkxYS1iZThkLWUzYjA5Yzk2NTMxMiIsImlhdCI6IjE3NDE4NDc2NDkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZmYWIxODJmLWVkYTUtNDBiYi1hNTZjLTljMGM2ZWNlNzdiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQxOTM0MDQ5LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvIn0.3BcmjJMSkZx4mnfxoupYXEsVUmEl0BUXnY896diHzp8',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching tests:', error)
		throw error
	}
}

interface TestAnswerResponse {
	id: string
	testCaseId: string
	answerText: string
	isCorrect: boolean
}
interface TestDetailsResponse {
	isSuccess: boolean
	result: {
		id: string
		name: string | null
		question: string
		questionUZ?: string
		questionUZK?: string
		questionRU?: string
		explanation: string
		explanationUZ?: string
		explanationUZK?: string
		explanationRU?: string
		mediaUrl: string | null
		testAnswers: TestAnswerResponse[]
		testAnswersForUser: any[] | null
	}
	statusCode: number
	errorMessages: string[]
}
//Id orqali testlarni olish
export async function getTestById(
	testId: string,
	language: string = 'uz'
): Promise<TestDetailsResponse> {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/GetById?testCaseId=${testId}&language=${language}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		const data = await response.json()

		if (!response.ok) {
			throw new Error(
				data.errorMessages?.join(', ') || 'Failed to fetch test data'
			)
		}
		return data
	} catch (error) {
		console.error('Error fetching test:', error)
		throw error
	}
}

// Update test
export async function updateTest(
	language: string,
	formData: FormData
): Promise<TestDetailsResponse> {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/Update?language=${language}`,
			{
				method: 'PUT',
				headers: {
					accept: '*/*',
				},
				body: formData,
			}
		)

		if (!response.ok) {
			throw new Error(`Error ${response.status} - ${response.statusText}`)
		}
		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('Error updating test:', error)
		throw error
	}
}

//POST test answer
interface ExamTestCase {
	testCaseId: string
	selectedAnswerId: string
}

interface SubmitAnswersResponse {
	isSuccess: boolean
	errorMessages?: string[]
	statusCode: number
	result?: SubmitAnswerResult
}
interface SubmitAnswerResult {
	id: string
	userId: string
	name: string | null
	createAt: Date
	examTestCases: ExamTestCases[]
	user: UserData
	correctAnswers: number
}
interface ExamTestCases {
	id: string
	examId: string
	testCaseId: string
	selectedAnswerId: string
	testCase: Test
}
interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}

export const submitAnswer = async ({
	language,
	userId,
	examTestCases,
}: {
	language: string
	userId: string
	examTestCases: ExamTestCase[]
}): Promise<SubmitAnswersResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/api/UserTest/SubmitAnswers?language=${language}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
				body: JSON.stringify({
					userId,
					examTestCases: examTestCases,
				}),
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const result = await response.json()
		console.log('Submission successful:', result)
		return result
	} catch (error) {
		console.error('Error submitting answers:', error)
		return {
			isSuccess: false,
			statusCode: 500,
			errorMessages: [(error as Error).message],
		}
	}
}

export const checkExam = async ({
	examId,
	language,
}: {
	examId: string
	language: string
}): Promise<SubmitAnswersResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/api/Dashboard/CheckExam?examId=${examId}&language=${language}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const result = await response.json()
		console.log('Submission successful:', result)
		const responseData: SubmitAnswersResponse = await response.json()
		return responseData
	} catch (error) {
		console.error(`Xatolik mavjud: ${error}`)
		return {
			isSuccess: false,
			statusCode: 500,
			errorMessages: [(error as Error).message],
		}
	}
}

export interface ExemItem {
	id: string
	userId: string
	name: null
	createAt: Date
	examTestCases: null
	user: UserData
	corrertAnswers: number
	questionCount?: number
}
export interface GetExemResult {
	items: ExemItem[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
}

export interface GetExemResponse {
	isSuccess: boolean
	result: GetExemResult
	statusCode: number
	errorMessages: string[]
}
export const getExemsUser = async ({
	UserID,
	pageSize,
	pageNumber,
}: {
	pageNumber: number
	pageSize: number
	UserID: string
}) => {
	try {
		const response = await fetch(
			`${API_URL}/api/Dashboard/GetExams?UserID=${UserID}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			{
				method: 'GET',
				headers: {
					Accept: '*/*',
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDVoZXZnZXR5cnRyMDk4YmI4cmViZXJid3I0dnZiODk0NSIsImp0aSI6IjRmZGIzM2IyLTk3MjktNDc1MS04ZGRlLThlNWRjZjllMDNjNCIsImlhdCI6IjE3NDE3NzY1MDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMwZmQ0YmJmLTQzZGUtNDRmMi1hZWMzLTE5ODE1YTE5MzdlYyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQxODYyOTAxLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvIn0.UY6bW04xnkyvHHbtveNqbFCguE6fkth5qMK5qiOEb18',
				},
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const data = await response.json()
		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
	}
}

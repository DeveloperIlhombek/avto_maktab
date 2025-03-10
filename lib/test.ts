/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'

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
	answerText: string
	isCorrect: boolean
}

interface CreateTestResponse {
	isSuccess: boolean
	result: {
		id: string
		name: string | null
		question: string | null
		explanation: string | null
		mediaUrl: FormData | null
		testAnswers: TestAnswerCreate[]
		testAnswersForUser: any[]
	}
	statusCode: number
	errorMessages: string[]
}

export interface TestAnswerCreate {
	answerTextUZ: string
	answerTextUZK: string
	answerTextRU: string
	isCorrect: boolean
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

//Create Test
export async function createTest(data: {
	questionUZ: string
	questionUZK: string
	questionRU: string
	explanationUZ: string
	explanationUZK: string
	explanationRU: string
	media?: File
	answers: TestAnswer[]
}): Promise<CreateTestResponse> {
	try {
		const params = new URLSearchParams({
			questionUZ: data.questionUZ,
			questionUZK: data.questionUZK,
			questionRU: data.questionRU,
			explanationUZ: data.explanationUZ,
			explanationUZK: data.explanationUZK,
			explanationRU: data.explanationRU,
			answers: encodeURIComponent(
				JSON.stringify(
					data.answers.map(answer => ({
						answerTextUZ: answer.answerTextUZ,
						answerTextUZK: answer.answerTextUZK,
						answerTextRU: answer.answerTextRU,
						isCorrect: answer.isCorrect,
					}))
				)
			),
		})
		const formdata = new FormData()
		if (data.media) {
			formdata.append('media', data.media)
		}
		const response = await fetch(`${API_URL}/api/TestCase/Create?${params}`, {
			method: 'POST',
			body: formdata,
		})

		const responseData = await response.json()
		if (!response.ok) {
			throw new Error(
				responseData.errorMessages?.join(', ') || 'Failed to create test'
			)
		}

		return responseData
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

//test ishlatdi =>post =>check exam
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

//CheckExam =>Javoblarni olish
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
				headers: { 'Content-Type': 'application/json', Accept: '*/*' },
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

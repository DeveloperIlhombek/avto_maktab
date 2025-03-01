//Code by:Ilhom Toshqulov

/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'
interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: string
}
export interface UserResponse {
	isSuccess: boolean
	result: UserData
	statusCode: number
	errorMessages: string[]
}
interface CreateUserData {
	name: string
	surname: string
	username: string
	email: string
	phone: string
	password: string
	role: string
}

interface TestAnswer {
	answerTextUZ: string
	answerTextUZK: string
	answerTextRU: string
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
		testAnswers: TestAnswer[]
		testAnswersForUser: any[]
	}
	statusCode: number
	errorMessages: string[]
}
//Barcha testlarni olish test uchun

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
					'Content-Type': 'application/json',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json() // JSON ma'lumotni olish
		return data
	} catch (error) {
		console.error('Error fetching tests:', error)
		return null
	}
}

//Barcha userlarni olish.

export const getAllUser = async () => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetAll?pageNumber=0&pageSize=10`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}

//ID orqali userni olish

export async function getUserById(userId: string): Promise<UserResponse> {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetById?userId=${userId}`,
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
				data.errorMessages?.join(', ') || 'Failed to fetch user data'
			)
		}

		return data
	} catch (error) {
		console.error('Error fetching user:', error)
		throw error
	}
}

//Create User
export const createUser = async (
	userData: CreateUserData
): Promise<UserResponse> => {
	try {
		const response = await fetch(`${API_URL}/api/User/Create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.errorMessages?.join(', ') || 'Failed to create user')
		}

		return data
	} catch (error) {
		console.error('Error creating user:', error)
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

//barcha testlarni ko'rish admin uchun

interface TestAnswer {
	id: string
	testCaseId: string
	answerText: string
	isCorrect: boolean
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

interface TestsResponse {
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

export const getAllTestsAdmin = async (
	pageNumber: number = 0,
	pageSize: number = 10
): Promise<TestsResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/GetAll?IsAdmin=true&language=uz&pageSize=${pageSize}&pageNumber=${pageNumber}`,
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
	Id: string,
	formData: FormData
): Promise<TestDetailsResponse> {
	try {
		const response = await fetch(`${API_URL}/api/TestCase/Update?Id=${Id}`, {
			method: 'PUT',
			headers: { accept: '*/*' },
			body: formData,
		})

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

// Delete test
export async function deleteTest(id: string): Promise<any> {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/Delete?testCaseId=${id}`,
			{
				method: 'DELETE',
			}
		)

		const responseData = await response.json()

		if (!response.ok) {
			throw new Error(
				responseData.errorMessages?.join(', ') || 'Delete xatolik yuz berdi'
			)
		}

		return responseData
	} catch (error) {
		console.error('Error deleting test:', error)
		throw error
	}
}

//Login User
export interface LoginData {
	login: string
	password: string
}

export interface LoginResponse {
	token: string
	message: string
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
	try {
		const response = await fetch(`${API_URL}/api/User/Login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: '*/*',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error('Login failed')
		}

		const result: LoginResponse = await response.json()
		//console.log(result)

		return result
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'Login request failed'
		)
	}
}

//Delete User
export async function deleteUser(userId: string): Promise<any> {
	try {
		const response = await fetch(
			`${API_URL}/api/User/Delete?userId=${userId}`,
			{
				method: 'DELETE',
			}
		)

		const responseData = await response.json()

		if (!response.ok) {
			throw new Error(
				responseData.errorMessages?.join(', ') || 'Delete xatolik yuz berdi'
			)
		}

		return responseData
	} catch (error) {
		console.error('Error deleting test:', error)
		throw error
	}
}

//Update User

export const updateUser = async (
	id: string,
	formData: FormData
): Promise<UserResponse> => {
	try {
		const response = await fetch(`${API_URL}/api/User/Update`, {
			method: 'PUT',
			headers: {
				accept: '*/*',
			},
			body: formData,
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message ||
					"Foydalanuvchi ma'lumotlarini yangilashda xatolik yuz berdi"
			)
		}

		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('Xato:', error)
		throw error
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'

interface UserResponse {
	isSuccess: boolean
	result: {
		id: string
		name: string
		surname: string
		username: string
		email: string
		phone: string
		role: string
	}
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

//Barcha testlarni olish

export const getAllTests = async () => {
	try {
		const response = await fetch(
			`${API_URL}/api/TestCase/GetAll?IsAdmin=true&language=uz&pageSize=10&pageNumber=0`,
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

export const getUserById = async (
	userId: string
): Promise<UserResponse | null> => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetById?userId=${userId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.errorMessages?.join(', ') ||
					`API error: ${response.status} - ${response.statusText}`
			)
		}

		const data: UserResponse = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching user:', error)
		throw error // Re-throw to handle in component
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
interface TestAnswer {
	testCaseId?: string
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
		mediaUrl: string | null
		testAnswers: any[]
		testAnswersForUser: any[]
	}
	statusCode: number
	errorMessages: string[]
}

export async function uploadImage(file: File): Promise<string> {
	try {
		const formData = new FormData()
		formData.append('file', file)

		const response = await fetch(`${API_URL}/api/upload`, {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			throw new Error('Failed to upload image')
		}

		const data = await response.json()
		return data.url
	} catch (error) {
		console.error('Error uploading image:', error)
		throw new Error('Failed to upload image')
	}
}

export async function createTest(data: {
	questionUZ: string
	questionUZK: string
	questionRU: string
	explanationUZ: string
	explanationUZK: string
	explanationRU: string
	mediaUrl?: string | null
	answers: Omit<TestAnswer, 'testCaseId'>[]
}): Promise<CreateTestResponse> {
	try {
		const params = new URLSearchParams()
		params.append('QuestionUZ', data.questionUZ)
		params.append('QuestionUZK', data.questionUZK)
		params.append('QuestionRU', data.questionRU)
		params.append('ExplanationUZ', data.explanationUZ)
		params.append('ExplanationUZK', data.explanationUZK)
		params.append('ExplanationRU', data.explanationRU)

		if (data.mediaUrl) {
			params.append('MediaUrl', data.mediaUrl)
		}

		data.answers.forEach(answer => {
			params.append(
				'Answers',
				JSON.stringify({
					answerTextUZ: answer.answerTextUZ,
					answerTextUZK: answer.answerTextUZK,
					answerTextRU: answer.answerTextRU,
					isCorrect: answer.isCorrect,
				})
			)
		})

		const response = await fetch(`${API_URL}/api/TestCase/Create?${params}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error('Failed to create test')
		}

		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('Error creating test:', error)
		throw error
	}
}

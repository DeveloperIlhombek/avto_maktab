/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'
export interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	password: string
	phone: string
	role: number
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
	role: number
}

// interface TestAnswer {
// 	answerTextUZ: string
// 	answerTextUZK: string
// 	answerTextRU: string
// 	isCorrect: boolean
// }

// interface CreateTestResponse {
// 	isSuccess: boolean
// 	result: {
// 		id: string
// 		name: string | null
// 		question: string | null
// 		explanation: string | null
// 		mediaUrl: FormData | null
// 		testAnswers: TestAnswer[]
// 		testAnswersForUser: any[]
// 	}
// 	statusCode: number
// 	errorMessages: string[]
// }

//Barcha userlarni olish.

export const getAllUser = async ({
	pageNumber,
	pageSize,
}: {
	pageSize: number
	pageNumber: number
}) => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetAll?role=3&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
					Accept: '*/*',
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
				headers: { accept: '*/*' },
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

interface UserDataLogin {
	id: string
	username: string
	role: number
}
export interface LoginData {
	login: string
	password: string
}

export interface ResultData {
	user: UserDataLogin
	accessToken: string
}
export interface LoginResponse {
	result: ResultData
}

export const loginUser = async (data: {
	login: string
	password: string
}): Promise<LoginResponse> => {
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

		const result = await response.json()

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
		// ID ni tekshirish
		if (!id) {
			throw new Error('Foydalanuvchi ID si topilmadi')
		}

		// FormData ni JSON ga o'girish (agar kerak bo'lsa)
		const jsonData = Object.fromEntries(formData.entries())

		// API so'rovini yuborish
		const response = await fetch(`${API_URL}/api/User/Update`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				accept: '*/*',
			},
			body: JSON.stringify(jsonData), // JSON formatida yuborish
		})

		// Xatolikni tekshirish
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message ||
					errorData.title ||
					errorData.detail ||
					"Foydalanuvchi ma'lumotlarini yangilashda xatolik yuz berdi"
			)
		}

		// Ma'lumotlarni qaytarish
		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('Xato:', error)
		throw error
	}
}

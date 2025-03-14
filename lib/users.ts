import { customFetch } from './api'

const API_URL = 'http://213.230.109.74:8080'
//const API_URL = 'https://9284dgg8-5000.euw.devtunnels.ms'

export interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	password: string
	role: number
}

export interface IUserResult {
	items: UserData[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
}

export interface UserResponse {
	isSuccess: boolean
	result: IUserResult
	statusCode: number
	errorMessages: string[]
}

export interface AddStudentToGroup {
	isSuccess: boolean
	result: UserData[]
	statusCode: number
	errorMessages: string[]
}

export const getAllInstructor = async ({
	pageSize,
	pageNumber,
}: {
	pageSize: number
	pageNumber: number
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/User/GetAll?role=2&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}

export const getAllStudent = async ({
	pageNumber,
	pageSize,
}: {
	pageSize: number
	pageNumber: number
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/User/GetAll?role=3&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}

interface UserDataById {
	id: string
	name: string
	surname: string
	username: string
	email: string
	password: string
	phone: string
	role: number
}
export interface UserResponseById {
	isSuccess: boolean
	result: UserDataById
	statusCode: number
	errorMessages: string[]
}
//Id orqwali studentlarni olish
export async function getUserById(userId: string): Promise<UserResponseById> {
	try {
		const response = await customFetch(
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

interface CreateUserData {
	name: string
	surname: string
	username: string
	email: string
	phone: string
	password: string
	role: number
}
//Create User
export const createUser = async (
	userData: CreateUserData
): Promise<UserResponse> => {
	try {
		const response = await customFetch(`${API_URL}/api/User/Create`, {
			method: 'POST',
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

//Update User
export const updateUser = async (
	id: string,
	formData: FormData
): Promise<UserResponseById> => {
	try {
		// ID ni tekshirish
		if (!id) {
			throw new Error('Foydalanuvchi ID si topilmadi')
		}

		// FormData ni JSON ga o'girish (agar kerak bo'lsa)
		const jsonData = Object.fromEntries(formData.entries())

		// API so'rovini yuborish
		const response = await customFetch(`${API_URL}/api/User/Update`, {
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

//Delete User
export async function deleteUser(userId: string) {
	try {
		const response = await customFetch(
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

//Add student to Group
export const addStudentsToGroup = async ({
	groupId,
	studentIds,
}: {
	groupId: string
	studentIds: string[]
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/UserTest/AddStudentsToGroup?groupId=${groupId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(studentIds),
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}

//api Get Group Students
export const getAllGroupStudent = async ({
	groupId,
	pageNumber,
	pageSize,
}: {
	groupId: string
	pageNumber: number
	pageSize: number
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/UserTest/GetGroupStudents?groupId=${groupId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				method: 'GET',
				headers: { Accept: '*/*' },
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const data = await response.json()

		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}

export const getGroupInstructor = async ({ groupId }: { groupId: string }) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/UserTest/GetGroupInstiructor?groupId=${groupId}`,
			{
				method: 'GET',
				headers: { Accept: '*/*' },
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const data = await response.json()
		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
		return null
	}
}
//Delete student from Group
export const deleteStudentsFromGroup = async ({
	groupId,
	studentIds,
}: {
	groupId: string
	studentIds: string[]
}) => {
	try {
		// studentIds ni Guid tipiga o'tkazish
		const userIds = studentIds.map(id => id)
		const response = await customFetch(
			`${API_URL}/api/UserTest/RemoveStudentsFromGroup?groupId=${groupId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userIds),
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		console.log('Students deleted successfully:', data)

		return data.result
	} catch (error) {
		console.error('Error deleting students:', error)
		return null
	}
}

export const updateUserParol = async (
	id: string,
	formData: { currentPassword: string; newPassword: string }
): Promise<UserResponse> => {
	try {
		// ID ni tekshirish
		if (!id) {
			throw new Error('Foydalanuvchi ID si topilmadi')
		}

		// API so'rovini yuborish
		const response = await customFetch(`${API_URL}/api/User/Update`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: '*/*',
			},
			body: JSON.stringify({
				id, // Foydalanuvchi ID-si
				currentPassword: formData.currentPassword, // Joriy parol
				newPassword: formData.newPassword, // Yangi parol
			}),
		})

		// Xatolikni tekshirish
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message ||
					errorData.title ||
					errorData.detail ||
					'Parolni yangilashda xatolik yuz berdi'
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

export interface IExamResult {
	id: string
	userId: string
	name: null | string
	createAt: Date
	examTestCases: ITestCase[]
	user: UserData
	corrertAnswers: number
	questionCount: number
}

export interface ITestCase {
	id: string
	examId: string
	testCaseId: string
	selectedAnswerId: string
	testCase: ITestCase
	testAnswer: null
}
export interface ITestCase {
	id: string
	name: null | string
	question: string
	explanation: string
	mediaUrl: string
	testAnswers: ITestAnswer[]
	testAnswersForUser: null
}
export interface ITestAnswer {
	id: string
	testCaseId: string
	answerText: string
	isCorrect: boolean
}
export const getCheckExem = async ({
	examId,
	language,
}: {
	examId: string
	language: string
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Dashboard/CheckExam?examId=${examId}&language=${language}`,
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
		return data.result
	} catch (error) {
		console.error('Error fetching users:', error)
	}
}

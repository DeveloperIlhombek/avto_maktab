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
		const response = await fetch(
			`${API_URL}/api/User/GetAll?role=2&pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
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
		const response = await fetch(
			`${API_URL}/api/User/GetAll?role=3&pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDVoZXZnZXR5cnRyMDk4YmI4cmViZXJid3I0dnZiODk0NSIsImp0aSI6IjYxY2U0ZmJmLWQyMGItNGVkZC05NTNmLWQxYTdlY2YwNzJjMiIsImlhdCI6IjE3NDE3NjA5MDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMwZmQ0YmJmLTQzZGUtNDRmMi1hZWMzLTE5ODE1YTE5MzdlYyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQxODQ3MzAxLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvIn0.b94wuoRKYtviS09ka94piqSpTSCEGqTpYI4z96MScuA',
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
//Add student to Group
export const addStudentsToGroup = async ({
	groupId,
	studentIds,
}: {
	groupId: string
	studentIds: string[]
}) => {
	try {
		const response = await fetch(
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
		const response = await fetch(
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
		const response = await fetch(
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
		const response = await fetch(
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
		const response = await fetch(`${API_URL}/api/User/Update`, {
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
		const response = await fetch(
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

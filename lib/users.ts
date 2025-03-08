const API_URL = 'http://213.230.109.74:8080'

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
	pageSize,
	pageNumber,
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
		console.log('Api det alll')
		console.log(data)

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
		const response = await fetch(
			`${API_URL}/api/UserTest/RemoveStudentsFromGroup?groupId=${groupId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ groupId, studentIds }),
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

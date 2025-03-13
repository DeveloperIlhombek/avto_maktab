/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://213.230.109.74:8080'

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

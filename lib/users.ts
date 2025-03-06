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

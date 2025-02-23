const API_URL = 'http://213.230.109.74:8080'

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

export const getUserById = async (userId: string) => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetById?userId=${userId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const data = await response.json()
		console.log(data)

		return data
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}

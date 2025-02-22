const API_URL = 'http://213.230.109.74:8080'
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

const API_URL = 'https://9284dgg8-5000.euw.devtunnels.ms'

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

		console.log('Fetched Tests:', data.isSuccess) // Konsolga chiqarish

		return data
	} catch (error) {
		console.error('Error fetching tests:', error)
		return null
	}
}

//import axios from './../node_modules/axios/index.d'
const API_URL = 'https://9284dgg8-5000.euw.devtunnels.ms'

export const getUserById = async () => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetById?userId=08dd50b3-6767-48d7-87e9-5fa06850ab7a`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`)
		}
		//console.log(JSON.parse(JSON.stringify(response)))

		return await response.json()
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}

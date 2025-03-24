const API_URL = 'http://213.230.109.74:8080'
//const API_URL = 'https://9284dgg8-5000.euw.devtunnels.ms'
//Login User

export interface UserDataLogin {
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
	isSuccess?: boolean
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

		if (result.token) {
			localStorage.setItem('token', result.token)
		}

		return result
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'Login request failed'
		)
	}
}
//==================== ========================

export const customFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const token = localStorage.getItem('token')

	// Headersni `Record<string, string>` sifatida aniqlaymiz
	const headers: Record<string, string> = {
		...(options.headers as Record<string, string>),
		Authorization: `Bearer ${token}`,
	}

	// Agar body `FormData` bo'lmasa, faqat `Content-Type: application/json` qo'shamiz
	if (!(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json'
	}

	const res = await fetch(url, { ...options, headers })

	if (!res.ok) {
		throw new Error(`API Error: ${res.statusText}`)
	}

	return res
}

//==================== ========================
//Get User By Id
export interface IGetUserByIdResult {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}
export const GetByusername = async (
	username: string
): Promise<IGetUserByIdResult> => {
	try {
		const response = await fetch(
			`${API_URL}/api/User/GetByusername?username=${username}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
				body: JSON.stringify(username),
			}
		)

		if (!response.ok) {
			throw new Error('Login failed')
		}
		const result = await response.json()

		// if (result.token) {
		// 	localStorage.setItem('token', result.token)
		// }
		console.log(result.result)

		return result.result
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'Login request failed'
		)
	}
}

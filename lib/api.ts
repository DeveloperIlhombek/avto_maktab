const API_URL = 'http://213.230.109.74:8080'

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

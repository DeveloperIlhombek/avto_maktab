import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// export const fetchData = async (
// 	endpoint: string,
// 	options: RequestInit = {}
// ) => {
// 	const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
// 		...options,
// 		headers: {
// 			'Content-Type': 'application/json',
// 			...(options.headers || {}),
// 		},
// 	})

// 	if (!response.ok) {
// 		throw new Error(`API error: ${response.status}`)
// 	}

// 	return response.json()
// }

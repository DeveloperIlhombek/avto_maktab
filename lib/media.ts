import { customFetch } from './api'

const API_URL = process.env.NEXT_PUBLIC_API_URL
export interface IFolderResponse {
	isSuccess: boolean
	result: IFolderResult
	statusCode: number
	errorMessages: string[]
}

export interface IFolderResult {
	id: string
	name: string
	createdDate: Date
}

export interface IFileResponse {
	isSuccess: boolean
	result: IFileResult[]
	statusCode: number
	errorMessages: string[]
}

export interface IFileResult {
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
	items: IFileItems[]
}
export interface IFileItems {
	fileName: string
	filePath: string
	folderId: string
	id: string
	uploadedDate: Date
}

// Get AllFolder

export const getFolder = async ({
	pageSize,
	pageNumber,
}: {
	pageSize: number
	pageNumber: number
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Folder/GetFolders?pageSize=${pageSize}&pageNumber=${pageNumber}`,

			{
				method: 'GET',
				headers: {
					Accept: '*/*',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching folders:', error)
		throw error
	}
}

//Get MediaFiles
export const getMediaFiles = async ({
	pageSize,
	pageNumber,
	folderId,
}: {
	pageSize: number
	pageNumber: number
	folderId: string
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Folder/GetMediaFiles?folderId=${folderId}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			{
				method: 'GET',
				headers: {
					Accept: '*/*',
				},
			}
		)
		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}
		const data = await response.json()

		return data.result
	} catch (error) {
		console.error('Error fetching tests:', error)
		return null
	}
}

import { customFetch } from './api'

const API_URL = 'http://213.230.109.74:8080'

// Groups API interfaces
export interface GroupItem {
	id: string
	name: string
	description: string
	instructorId: string
	isActive: boolean
	isDeleted: boolean
	createdDate: string
	deletedDate: string | null
}

export interface GroupResponse {
	isSuccess: boolean
	result: {
		items: GroupItem[]
		pageNumber: number
		pageSize: number
		totalCount: number
		totalPages: number
	}
	statusCode: number
	errorMessages: string[]
}

interface SingleGroupResponse {
	isSuccess: boolean
	result: GroupItem
	statusCode: number
	errorMessages: string[]
}
// Get group All
export const getGroups = async ({
	pageSize,
	pageNumber,
	isActive,
	isDeleted,
}: {
	pageSize: number
	pageNumber: number
	isActive: boolean
	isDeleted: boolean
}) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Group/GetGroups?isActive=${isActive}&isDeleted=${isDeleted}&pageNumber=${pageNumber}&pageSize=${pageSize}
`,
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
		console.error('Error fetching tests:', error)
		return null
	}
}

// Get group by ID
export const getGroupById = async (id: string) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Group/GetGroupById?id=${id}`,
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
		console.error('Error fetching group:', error)
		throw error
	}
}

// Create group
export const createGroup = async (groupData: {
	name: string
	description: string
	instructorId: string
}) => {
	try {
		const response = await customFetch(`${API_URL}/api/Group/CreateGroup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(groupData),
		})

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error creating group:', error)
		throw error
	}
}
// Update group
export const updateGroup = async (
	id: string,
	groupData: {
		name: string
		description: string
		instructorId: string
	}
): Promise<SingleGroupResponse> => {
	try {
		const updatePayload = {
			id,
			...groupData,
		}

		const response = await customFetch(`${API_URL}/api/Group/UpdateGroup`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatePayload),
		})

		if (!response.ok) {
			throw new Error(`API error: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error updating group:', error)
		throw error
	}
}

// Delete group
export const deleteGroup = async (id: string) => {
	try {
		const response = await customFetch(
			`${API_URL}/api/Group/DeleteGroup?id=${id}`,
			{
				method: 'DELETE',
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
		console.error('Error deleting group:', error)
		throw error
	}
}

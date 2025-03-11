import { getAllInstructor } from '@/lib/users'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

function Page() {
	useEffect(() => {
		const fetchInstructor = async () => {
			try {
				const response = await getAllInstructor({ pageNumber: 0, pageSize: 20 })
				console.log(response)
			} catch (error) {
				toast(`Xatolik${error}`)
			}
		}
		fetchInstructor()
	}, [])

	return <div>ddd</div>
}

export default Page

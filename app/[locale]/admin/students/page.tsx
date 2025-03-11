import AllUser from './_components/all-users'
import { getAllUser } from '@/lib/api'

export default async function Page() {
	const data = await getAllUser({ pageSize: 20, pageNumber: 0 })

	if (!data) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-gray-800'>
						Xatolik yuz berdi
					</h2>
					<p className='text-gray-600'>
						Ma&apos;lumotlarni yuklashda xatolik yuz berdi
					</p>
				</div>
			</div>
		)
	}

	return <AllUser initialData={data} />
}

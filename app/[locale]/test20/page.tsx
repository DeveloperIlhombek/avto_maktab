'use client'
import { usePathname } from 'next/navigation'
import { TestPage } from './_components/testpage'
import { GetByusername } from '@/lib/api'
import React, { useState } from 'react'
import { toast } from 'sonner'

function Page() {
	const [username, setUsername] = useState('')
	const [userFound, setUserFound] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const pathname = usePathname()
	const language = pathname.split('/')[1]

	const handleGetUser = async () => {
		if (!username.trim()) {
			setError('Username kiritishingiz kerak')
			return
		}

		setLoading(true)
		setError('')

		try {
			const response = await GetByusername(username)
			if (response.isSuccess) {
				setUserFound(true)
			} else {
				setError('Foydalanuvchi topilmadi')
				setUserFound(false)
			}
		} catch (err) {
			setError(`Xatolik yuz berdi: ${err}`)
			toast.error(`Instructorlarni olishda  xatolik yuz berdi ${error}`)
			setUserFound(false)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='p-4'>
			{!userFound ? (
				<div className='max-w-md mx-auto'>
					<h1 className='text-2xl font-bold mb-4'>Foydalanuvchi tekshirish</h1>

					<div className='flex gap-2 mb-4'>
						<input
							type='text'
							value={username}
							onChange={e => setUsername(e.target.value)}
							placeholder='Username'
							className='flex-1 px-4 py-2 border rounded'
						/>
						<button
							onClick={handleGetUser}
							disabled={loading}
							className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
						>
							{loading ? 'Tekshirilmoqda...' : 'Tekshirish'}
						</button>
					</div>

					{error && <p className='text-red-500 mb-4'>{error}</p>}
				</div>
			) : (
				<TestPage language={language} />
			)}
		</div>
	)
}

export default Page

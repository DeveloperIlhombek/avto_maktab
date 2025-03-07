'use client'

import { getFolder, IFolderResult } from '@/lib/media'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { FolderClosed, Loader2 } from 'lucide-react'
import Link from 'next/link'

function MediaPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	//const [mediaResponse, setMediaResponse] = useState<IFolderResponse>()
	const [totalPages, setTotalPages] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [media, setMedia] = useState<IFolderResult[]>([])
	const [currentPage, setCurrentPage] = useState(0)

	useEffect(() => {
		fetchMediaFolder(currentPage)
	}, [currentPage])

	const fetchMediaFolder = async (pageNumber: number) => {
		try {
			setLoading(true)
			setError(null)
			const responseFolder = await getFolder({ pageSize: 20, pageNumber })

			if (responseFolder.isSuccess) {
				setMedia(responseFolder.result)
				setTotalPages(responseFolder.result.totalPages)
				setTotalCount(responseFolder.result.totalCount)
			} else {
				setError(
					responseFolder.errorMessages?.join(', ') || 'Failed to fetch folders'
				)
			}
		} catch (error) {
			setError('Failed to fetch folders')
			console.error('Error fetching folders:', error)
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	return (
		<div className='container min-h-screen mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Media Page</h1>
			{loading && (
				<div className='flex justify-center items-center py-10'>
					<Loader2 className='h-6 w-6 animate-spin text-gray-500' />
				</div>
			)}
			{error && (
				<Alert variant='destructive' className='mb-4'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{!loading && !error && (
				<>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{media.map(folder => (
							<Link key={folder.id} href={`/uz/media/${folder.id}`}>
								<Card key={folder.id} className='shadow-lg bg-green-300/20'>
									<CardHeader>
										<CardTitle className='flex items-center justify-between gap-4'>
											{folder.name} <FolderClosed size={48} />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className='text-gray-500'>
											Yaratilgan sana:{' '}
											{new Date(folder.createdDate).toLocaleDateString()}
										</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					<div className='flex justify-around items-center mt-6'>
						<Button
							variant='outline'
							disabled={currentPage === 0}
							onClick={() => handlePageChange(currentPage - 1)}
						>
							Previous
						</Button>
						<span className='text-gray-600'>
							Page {currentPage + 1} of {totalPages}
						</span>
						<Button
							disabled={currentPage >= totalPages - 1}
							onClick={() => handlePageChange(currentPage + 1)}
						>
							Next
						</Button>
					</div>

					<p className='text-center text-gray-500 mt-4'>
						Total Folders: {totalCount}
					</p>
				</>
			)}
		</div>
	)
}

export default MediaPage

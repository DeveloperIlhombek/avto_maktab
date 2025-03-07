'use client'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { getMediaFiles, IFileResponse, IFileResult } from '@/lib/media'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page() {
	const [mediaFile, setMediaFile] = useState<IFileResult[]>([])
	const pathname = usePathname()
	const folderId = pathname.split('/')[3]
	console.log(folderId)

	useEffect(() => {
		fetchMediaFile()
	}, [folderId])

	const fetchMediaFile = async () => {
		const mediaFileResponse: IFileResponse = await getMediaFiles({
			pageSize: 20,
			folderId: folderId,
			pageNumber: 0,
		})
		setMediaFile(mediaFileResponse.result)
	}

	return (
		<div className='container min-h-screen mt-8'>
			{mediaFile.map(media => (
				<Card key={media.id} className='bg-muted w-1/3'>
					<CardHeader>
						<CardTitle>{media.fileName}</CardTitle>
						<CardContent>
							<CardDescription>
								<video width='full' height='full' controls preload='none'>
									<source
										src={`http://213.230.109.74:8080/${media.filePath}`}
										type='video/mp4'
									/>
									<track
										src='/path/to/captions.vtt'
										kind='subtitles'
										srcLang='en'
										label='English'
									/>
									Your browser does not support the video tag.
								</video>
								<div className='mt-4 flex justify-end items-center gap-4'>
									<p className='text-xl'>Yuklangan sana:</p>
									<h3 className='text-xl'>
										{new Date(media.uploadedDate).toLocaleDateString()}
									</h3>
								</div>
							</CardDescription>
						</CardContent>
					</CardHeader>
				</Card>
			))}
		</div>
	)
}

export default Page

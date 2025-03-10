'use client'
import { usePathname } from 'next/navigation'
import { TestPage } from './_components/test-page'

export default function Page() {
	const pathname = usePathname()
	const mockUserId = pathname.split('/')[3]
	const language = pathname.split('/')[1]

	return <TestPage userId={mockUserId} language={language} />
}

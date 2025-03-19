'use client'
import { usePathname } from 'next/navigation'
import { TestPage } from './_components/testpage'

export default function Page() {
	const pathname = usePathname()
	const language = pathname.split('/')[1]

	return <TestPage language={language} />
}

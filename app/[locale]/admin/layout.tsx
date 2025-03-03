'use client'

import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<div className='flex h-[calc(100vh-4rem)]'>
				<Sidebar />
				<main className='flex-1 overflow-y-auto p-8'>{children}</main>
			</div>
		</div>
	)
}

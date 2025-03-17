'use client'

import { Header } from './_components/header'
import { Sidebar } from './_components/sidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='max-h-screen bg-background'>
			<Header />

			<div className='flex'>
				<Sidebar />

				<main className='w-full overflow-y-auto transition-all duration-300 '>
					<div className='p-14 bg-gradient-to-b from-sky-100/10 via-sky-900/30 to-sky-100/10 dark:from-sky-900/10 dark:via-sky-300/20 dark:to-sky-900/10'>
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}

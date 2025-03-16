import React from 'react'
import PracticeNavbar from './_components/practice-navbar'
import { Separator } from '@/components/ui/separator'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<PracticeNavbar />
				<Separator />
				<main>{children}</main>
			</div>
		</>
	)
}

export default Layout

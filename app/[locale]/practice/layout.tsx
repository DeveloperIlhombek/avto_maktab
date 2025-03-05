import React from 'react'
import PracticeNavbar from './_components/practice-navbar'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<PracticeNavbar />
				<main>{children}</main>
			</div>
		</>
	)
}

export default Layout

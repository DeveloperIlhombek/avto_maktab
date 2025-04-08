import React from 'react'
import ChildrenNavbar from '@/components/shared/children-navbar'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<ChildrenNavbar />
				<main>{children}</main>
			</div>
		</>
	)
}

export default Layout

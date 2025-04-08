import ChildrenNavbar from '@/components/shared/children-navbar'
import React from 'react'

interface Props {
	children: React.ReactNode
}

function Fineslayout({ children }: Props) {
	return (
		<div>
			<ChildrenNavbar />
			<main>{children}</main>
		</div>
	)
}

export default Fineslayout

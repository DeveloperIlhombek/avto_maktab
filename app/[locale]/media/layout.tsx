import React from 'react'
import NavbarMedia from './_components/navbar-media'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<NavbarMedia />
				<main>{children}</main>
			</div>
		</>
	)
}

export default Layout

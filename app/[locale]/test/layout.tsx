import React from 'react'
import NavbarTest from './_components/navbar-test'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<NavbarTest />
				<main className='mx-7'>{children}</main>
			</div>
		</>
	)
}

export default Layout

import React from 'react'
import NavbarMedia from './_components/navbar-media'
import FooterMedia from './_components/footer-media'

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
			<FooterMedia />
		</>
	)
}

export default Layout

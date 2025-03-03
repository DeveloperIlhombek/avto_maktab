import React from 'react'
import Footer from '@/components/shared/footer'
import Navbar from '@/components/shared/navbar'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<Navbar />
				<main>{children}</main>
			</div>
			<Footer />
		</>
	)
}

export default Layout

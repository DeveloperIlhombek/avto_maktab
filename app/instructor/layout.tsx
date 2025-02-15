import React from 'react'

interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return <main>{children}</main>
}

export default Layout

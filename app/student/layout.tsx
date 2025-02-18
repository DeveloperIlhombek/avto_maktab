interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<main>{children}</main>
			</div>
		</>
	)
}

export default Layout

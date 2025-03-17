interface Props {
	children: React.ReactNode
}

function Layout({ children }: Props) {
	return (
		<>
			<div>
				<main className=' bg-gradient-to-b from-sky-100/10 via-sky-900/30 to-sky-100/10 dark:from-sky-900/10 dark:via-sky-300/20 dark:to-sky-900/10'>
					{children}
				</main>
			</div>
		</>
	)
}

export default Layout

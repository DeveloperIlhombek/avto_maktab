import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { Toaster } from '@/components/ui/sonner'
const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
})

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
	variable: '--font-roboto',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'Online Avto-maktab',
	description: 'online avto-maktab uchun web-site',
}

interface Props {
	children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={` ${roboto.variable} ${inter.variable} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<Toaster position='top-center' />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

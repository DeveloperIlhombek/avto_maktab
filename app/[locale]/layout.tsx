import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import './globals.css'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Locale } from '@/i18n/navigation'

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
	description: 'Online avto-maktab uchun web-site',
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	// `locale` ni tekshiramiz
	const { locale } = await params

	if (!routing.locales.includes(locale as Locale)) {
		notFound()
	}
	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${roboto.variable} ${inter.variable} antialiased`}>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange
					>
						<Toaster position='top-center' />
						{children}
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}

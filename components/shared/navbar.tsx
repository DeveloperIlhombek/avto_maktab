'use client'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { navLink } from '@/constanta'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LoginDialog } from '@/app/[locale]/(root)/_components/loginDialog'

function Navbar() {
	const t = useTranslations('Kirish')
	const pathname = usePathname()

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	return (
		<div className='fixed inset-0 z-40 h-20 bg-background/70 backdrop-blur-xl'>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between border-b'>
				<h1 className='text-4xl text-blue-500 font-extrabold font-roboto'>
					<Link href={`${getLanguagePrefix()}`}>Avto Maktab</Link>
				</h1>
				<div className='flex items-center gap-4 font-bold text-xl'>
					{navLink.map(item => (
						<Link key={item.id} href={item.url}>
							{t(item.name)}
						</Link>
					))}
				</div>
				<div className='flex items-center gap-4'>
					<ModeToggle />
					<LanguageSwitcher />
					<LoginDialog
						trigger={<Button variant='custom'>{t('kirish')}</Button>}
					/>

					{/* <GetbyusernameDialog /> */}
				</div>
			</div>
		</div>
	)
}

export default Navbar

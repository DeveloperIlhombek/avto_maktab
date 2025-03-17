'use client'
import React from 'react'

import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavbarMedia() {
	const pathname = usePathname()
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	return (
		<header className='h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container h-full px-4'>
				<div className='flex h-full items-center justify-between'>
					<div className='font-bold text-3xl text-blue-500'>
						<Link href={`${getLanguagePrefix()}`}>AVTOMAKTAB</Link>
					</div>

					<div className='flex items-center space-x-4'>
						<ModeToggle />
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</header>
	)
}
export default NavbarMedia

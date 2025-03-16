import React from 'react'

import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

function NavbarMedia() {
	return (
		<header className='h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container h-full px-4'>
				<div className='flex h-full items-center justify-between'>
					<div className='font-bold text-2xl text-primary'>AVTOMAKTAB</div>

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

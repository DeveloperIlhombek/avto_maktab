'use client'

import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
	return (
		<header className='h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container h-full px-4'>
				<div className='flex h-full items-center justify-between'>
					{/* Mobile Menu Button */}

					<div className='font-bold text-xl md:text-3xl text-blue-500'>
						AVTOMAKTAB
					</div>

					<nav className='flex items-center space-x-2'>
						<ModeToggle />
						<LanguageSwitcher />
						<div className='flex p-0 m-0 text-xs md:text-sm font-bold items-center justify-center gap-0 flex-col'>
							<span>Admin</span>
						</div>
						<Avatar>
							<AvatarFallback className='bg-green-400'>A</AvatarFallback>
						</Avatar>
					</nav>
				</div>
			</div>
		</header>
	)
}

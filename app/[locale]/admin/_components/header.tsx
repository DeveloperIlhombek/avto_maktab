'use client'

import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowLeftCircle } from 'lucide-react'
// import { getUserById, UserDataById } from '@/lib/users'
// import { useEffect, useState } from 'react'

export function Header() {
	const pathname = usePathname()
	//const [adminData, setAdminData] = useState<UserDataById>()
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	// useEffect(() => {
	// 	const getAdminData = async () => {
	// 		const response = await getUserById('83c6166b-9fd6-408e-9e02-4a09bdc0bb0c')
	// 		setAdminData(response.result)
	// 		console.log(adminData)
	// 	}
	// }, [])

	const handleLogout = () => {
		localStorage.removeItem('token')
		window.location.replace(`${getLanguagePrefix()}`)
	}
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
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarFallback className='bg-green-400'>A</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Kabinet</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link
										href={`${getLanguagePrefix()}/admin/settings`}
										className='flex items-center gap-2'
									>
										Sozlamalar
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										href={`${getLanguagePrefix()}`}
										className='flex items-center gap-2'
									>
										<ArrowLeft /> Bosh sahifa
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Button
										variant={'link'}
										className='w-full p-0'
										onClick={handleLogout}
									>
										<Link
											href={`${getLanguagePrefix()}`}
											className='flex items-center gap-2 text-red-500 font-bold'
										>
											<ArrowLeftCircle /> Chiqish
										</Link>
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>
			</div>
		</header>
	)
}

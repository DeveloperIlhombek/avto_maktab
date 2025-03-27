'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	ArrowLeft,
	ArrowLeftCircle,
	ClipboardCheck,
	Home,
	Menu,
	Settings,
	User,
	X,
} from 'lucide-react'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { getUserById } from '@/lib/users'
import { useTranslations } from 'next-intl'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { LanguageSwitcherStudent } from '@/components/shared/language-switcher-student'
import Image from 'next/image'

interface UserData {
	id: string
	name: string
	surname: string
	username: string
	email: string
	phone: string
	role: number
}
export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [userData, setUserData] = useState<UserData | null>(null)
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const Id = pathname.split('/')[3]
	const t = useTranslations('Student')
	const language =
		pathSegments.length > 1 && ['uz', 'uzk', 'ru'].includes(pathSegments[1])
			? (pathSegments[1] as 'uz' | 'uzk' | 'ru')
			: 'uz'

	const getLanguagePrefix = () => {
		return ['uz', 'uzk', 'ru'].includes(language) ? `/${language}` : ''
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await getUserById(Id)

				if (response.isSuccess && response.result) {
					setUserData(response.result)
				}
			} catch (error) {
				console.error('Error fetching user:', error)
			}
		}

		if (Id) {
			fetchUser()
		}
	}, [Id])

	useEffect(() => {
		setIsSidebarOpen(false)
	}, [pathname])

	const handleLogout = () => {
		localStorage.removeItem('token')
		window.location.replace(`${getLanguagePrefix()}`)
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	const navigation = [
		{
			id: 1,
			name: t('testlar'),
			href: '/',
			icon: ClipboardCheck,
		},
		{
			id: 3,
			name: t('dashboard'),
			href: '/dashboard',
			icon: Home,
		},
		{
			id: 2,
			name: t('shaxsiymalumotlar'),
			href: '/profile',
			icon: User,
		},

		{
			id: 4,
			name: t('sozlamalar'),
			href: '/settings',
			icon: Settings,
		},
		{
			id: 5,
			name: 'Bosh sahifaga qaytish',
			href: `${getLanguagePrefix()}`,
			icon: ArrowLeft,
		},
	]

	return (
		<div className='min-h-screen bg-background'>
			{/* Navbar */}
			<header className='px-5 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='flex h-20 items-center justify-center space-x-4'>
					<Button
						variant='custom'
						className='mr-2 p-4 text-base hover:bg-transparent focus:ring-0'
						onClick={toggleSidebar}
					>
						{isSidebarOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</Button>

					<div className='mr-4 hidden md:flex'>
						<Link href={`${getLanguagePrefix()}`}>
							<Image
								src={'/logofile1.png'}
								alt='logo'
								width={240}
								height={80}
								className='object-contain'
							/>
						</Link>
					</div>

					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<div className='w-full flex-1 md:w-auto md:flex-none'>
							{/* Add search if needed */}
						</div>
						<nav className='flex items-center justify-center space-x-2 flex-1'>
							<div className=' text-center flex-1'>
								<LanguageSwitcherStudent />
							</div>
							<ModeToggle />
							<div className='flex items-center justify-center gap-2'>
								<div className='flex p-0 m-0 text-sm font-bold items-center justify-center gap-0 flex-col'>
									<span>{userData?.name}</span>
									<span>{userData?.surname}</span>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Avatar>
											<AvatarFallback className='bg-green-500/75'>
												{`${userData?.name[0]}${userData?.surname[0]}` || 'CN'}
											</AvatarFallback>
										</Avatar>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>Shaxsiy kabinet</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<Link
												href={`${getLanguagePrefix()}/student/${
													userData?.id
												}/settings`}
												className='flex items-center gap-2'
											>
												<Settings className='h-4 w-4' />
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
												className='w-full h-8 justify-start'
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
							</div>
						</nav>
					</div>
				</div>
			</header>

			{/* Mobile Sidebar - Only shown when isSidebarOpen is true */}
			{isSidebarOpen && (
				<div className='fixed inset-0 z-50 md:hidden'>
					<div
						className='fixed inset-0 bg-background/80 backdrop-blur-sm'
						onClick={() => setIsSidebarOpen(false)}
					/>
					<div className='fixed inset-y-0 left-0 w-full max-w-xs border-r bg-background p-6 shadow-lg'>
						<div className='flex items-center justify-end'>
							<Button
								variant='custom'
								size='icon'
								onClick={() => setIsSidebarOpen(false)}
							>
								<X className='h-6 w-6' />
							</Button>
						</div>
						<nav className='mt-8 flex flex-col space-y-2'>
							{navigation.map(item => (
								<Link key={item.id} href={item.href}>
									<Button
										variant={pathname === item.href ? 'secondary' : 'ghost'}
										className='w-full justify-start'
									>
										<item.icon className=' h-4 w-4' />
										{item.name}
									</Button>
								</Link>
							))}
							<Button
								variant={'ghost'}
								className='w-full justify-start'
								onClick={handleLogout}
							>
								<Link
									href={`${getLanguagePrefix()}`}
									className='flex items-center gap-2 text-red-500 font-bold'
								>
									<ArrowLeftCircle className='mr-0 h-4 w-4' />
									Chiqish
								</Link>
							</Button>
						</nav>
					</div>
				</div>
			)}

			{/* Desktop Sidebar - Only shown when isSidebarOpen is true */}
			{isSidebarOpen && (
				<div className='hidden md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col border-r bg-background'>
					<div className='flex flex-col space-y-4 py-4'>
						<nav className='grid mt-4 gap-1 px-2'>
							{navigation.map(item => (
								<Link
									key={item.id}
									href={cn(
										item.href !== `${getLanguagePrefix()}`
											? `${getLanguagePrefix()}/student/${Id}${item.href}`
											: `${getLanguagePrefix()}`
									)}
								>
									<Button
										variant={pathname === item.href ? 'secondary' : 'ghost'}
										className='w-full justify-start'
									>
										<item.icon className='mr-0 h-4 w-4' />
										{item.name}
									</Button>
								</Link>
							))}
							<Button
								variant={'ghost'}
								className='w-full justify-start'
								onClick={handleLogout}
							>
								<Link
									href={`${getLanguagePrefix()}`}
									className='flex items-center gap-2 text-red-500 font-bold'
								>
									<ArrowLeftCircle className='mr-0 h-4 w-4' />
									Chiqish
								</Link>
							</Button>
						</nav>
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className={isSidebarOpen ? 'md:pl-56' : ''}>
				<main className='p-2'>{children}</main>
			</div>
		</div>
	)
}

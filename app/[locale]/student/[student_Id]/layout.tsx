'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	ClipboardCheck,
	GraduationCap,
	Home,
	LogOut,
	Menu,
	User,
	Wallet,
	X,
} from 'lucide-react'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { getUserById } from '@/lib/api'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

const navigation = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: Home,
	},
	{
		name: "Shaxsiy ma'lumotlar",
		href: '/profile',
		icon: User,
	},

	{
		name: 'Testlar',
		href: '/tests',
		icon: ClipboardCheck,
	},

	{
		name: "To'lovlar",
		href: '/payments',
		icon: Wallet,
	},
]
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

	return (
		<div className='min-h-screen bg-background'>
			{/* Navbar */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-14 items-center'>
					<div className='mr-4 hidden md:flex'>
						<Link
							href={`${getLanguagePrefix()}/student/${Id}`}
							className='mr-6 flex items-center space-x-2'
						>
							<GraduationCap className='h-6 w-6' />
							<span className='hidden font-bold sm:inline-block'>
								E-AVTOMAKTAB
							</span>
						</Link>
					</div>
					<Button
						variant='ghost'
						className='mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden'
						onClick={() => setIsSidebarOpen(true)}
					>
						<Menu className='h-6 w-6' />
					</Button>
					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<div className='w-full flex-1 md:w-auto md:flex-none'>
							{/* Add search if needed */}
						</div>
						<nav className='flex items-center space-x-2'>
							<ModeToggle />
							<LanguageSwitcher />
							<Avatar>
								<AvatarFallback className='bg-green-400'>
									{userData?.name[0] || 'CN'}
								</AvatarFallback>
							</Avatar>
						</nav>
					</div>
				</div>
			</header>

			{/* Sidebar */}
			<div
				className={`fixed inset-0 z-50 md:hidden ${
					isSidebarOpen ? 'block' : 'hidden'
				}`}
			>
				<div className='fixed inset-0 bg-background/80 backdrop-blur-sm' />
				<div className='fixed inset-y-0 left-0 w-full max-w-xs border-r bg-background p-6 shadow-lg'>
					<div className='flex items-center justify-between'>
						<Link
							href={`${getLanguagePrefix()}/student/dashboard`}
							className='flex items-center space-x-2'
						>
							<GraduationCap className='h-6 w-6' />
							<span className='font-bold'>E-AVTOMAKTAB</span>
						</Link>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsSidebarOpen(false)}
						>
							<X className='h-6 w-6' />
						</Button>
					</div>
					<nav className='mt-8 flex flex-col space-y-2'>
						{navigation.map(item => (
							<Link key={item.href} href={item.href}>
								<Button
									variant={pathname === item.href ? 'secondary' : 'ghost'}
									className='w-full justify-start'
								>
									<item.icon className='mr-2 h-4 w-4' />
									{item.name}
								</Button>
							</Link>
						))}
						<Button
							variant='ghost'
							className='w-full justify-start text-red-500'
						>
							<LogOut className='mr-2 h-4 w-4' />
							Chiqish
						</Button>
					</nav>
				</div>
			</div>

			{/* Desktop Sidebar */}
			<div className='hidden border-r bg-background md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col'>
				<div className='flex flex-col space-y-4 py-4'>
					<nav className='grid gap-1 px-2'>
						{navigation.map(item => (
							<Link
								key={item.href}
								href={`${getLanguagePrefix()}/student/${Id}${item.href}`}
							>
								<Button
									variant={pathname === item.href ? 'secondary' : 'ghost'}
									className='w-full justify-start'
								>
									<item.icon className='mr-2 h-4 w-4' />
									{item.name}
								</Button>
							</Link>
						))}
					</nav>
					<div className='px-2 mt-auto'>
						<Button
							variant='ghost'
							className='w-full justify-start text-red-500'
						>
							<LogOut className='mr-2 h-4 w-4' />
							Chiqish
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='md:pl-56'>
				<main className='container py-6'>{children}</main>
			</div>
		</div>
	)
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	ClipboardCheck,
	Clock,
	GraduationCap,
	Home,
	LogOut,
	Menu,
	User,
	Wallet,
	X,
} from 'lucide-react'
import { ModeToggle } from '@/components/shared/mode-toggle'

const navigation = [
	{
		name: 'Dashboard',
		href: '/student/123/dashboard',
		icon: Home,
	},
	{
		name: "Shaxsiy ma'lumotlar",
		href: '/student/123/profile',
		icon: User,
	},

	{
		name: 'Testlar',
		href: '/test',
		icon: ClipboardCheck,
	},

	{
		name: "To'lovlar",
		href: '/student/123/payments',
		icon: Wallet,
	},
]

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const pathname = usePathname()
	console.log(pathname)

	return (
		<div className='min-h-screen bg-background'>
			{/* Navbar */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-14 items-center'>
					<div className='mr-4 hidden md:flex'>
						<Link
							href='/student/123'
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
							<Button variant='ghost' size='icon' aria-label='Timer'>
								<Clock className='h-4 w-4' />
							</Button>
							<Avatar>
								<AvatarFallback>AR</AvatarFallback>
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
							href='/student/dashboard'
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

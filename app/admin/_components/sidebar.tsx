'use client'

import { cn } from '@/lib/utils'
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	ClipboardCheck,
	Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
	{
		title: 'Dashboard',
		icon: LayoutDashboard,
		href: '/admin',
	},
	{
		title: "O'quvchilar",
		icon: Users,
		href: '/admin/students',
	},
	{
		title: 'Instruktorlar',
		icon: GraduationCap,
		href: '/admin/instructors',
	},
	{
		title: 'Testlar',
		icon: ClipboardCheck,
		href: '/admin/tests',
	},
	{
		title: 'Sozlamalar',
		icon: Settings,
		href: '/admin/settings',
	},
]

export function Sidebar() {
	const pathname = usePathname()

	return (
		<div className='w-64 border-r bg-card'>
			<div className='flex h-full flex-col'>
				<div className='flex-1 overflow-y-auto py-4'>
					<nav className='grid items-start px-4 gap-2'>
						{menuItems.map((item, index) => {
							const isActive = pathname === item.href

							return (
								<Link
									key={index}
									href={item.href}
									className={cn(
										'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
										isActive ? 'bg-accent' : 'transparent',
										isActive
											? 'text-accent-foreground'
											: 'text-muted-foreground'
									)}
								>
									<item.icon className='h-4 w-4' />
									{item.title}
								</Link>
							)
						})}
					</nav>
				</div>

				{/* <div className='border-t p-4'>
					<Button
						variant='ghost'
						className='w-full justify-start gap-3 text-muted-foreground'
					>
						<LogOut className='h-4 w-4' />
						Chiqish
					</Button>
				</div> */}
			</div>
		</div>
	)
}

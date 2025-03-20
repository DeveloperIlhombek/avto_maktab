'use client'

import { cn } from '@/lib/utils'
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	ClipboardCheck,
	GroupIcon,
	Settings,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
	const t = useTranslations('Admin')
	const pathname = usePathname()

	// Extract the language prefix from the pathname
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		// Check if the first segment after the initial slash is a language code
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	const menuItems = [
		{
			title: `${t('dashboard')}`,
			icon: LayoutDashboard,
			href: '/admin',
		},
		{
			title: `${t('students')}`,
			icon: Users,
			href: '/admin/students',
		},
		{
			title: `${t('instructors')}`,
			icon: GraduationCap,
			href: '/admin/instructors',
		},
		{
			title: `${t('tests')}`,
			icon: ClipboardCheck,
			href: '/admin/tests',
		},
		{
			title: `${t('groups')}`,
			icon: GroupIcon,
			href: '/admin/groups',
		},
		{
			title: `${t('settings')}`,
			icon: Settings,
			href: '/admin/settings',
		},
	]
	const languagePrefix = getLanguagePrefix()

	// Check if a path is active by comparing the route without the language prefix
	const isPathActive = (path: string) => {
		const pathWithoutLang = pathname.replace(languagePrefix, '')
		return pathWithoutLang === path || pathname.endsWith(path)
	}

	return (
		<div className='w-64 border-r bg-card'>
			<div className='flex h-full flex-col'>
				<div className='flex-1 overflow-y-auto py-4'>
					<nav className='grid items-start px-4 gap-2'>
						{menuItems.map((item, index) => {
							const isActive = isPathActive(item.href)

							// Construct the full href with language prefix
							const fullHref = `${languagePrefix}${item.href}`

							return (
								<Link
									key={index}
									href={fullHref}
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
			</div>
		</div>
	)
}

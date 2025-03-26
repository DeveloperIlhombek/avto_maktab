'use client'
//import { ModeToggle } from '@/components/shared/mode-toggle'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcherStudent } from '@/components/shared/language-switcher-student'
import Image from 'next/image'
function PracticeNavbar() {
	const pathname = usePathname()

	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	return (
		<div className='inset-0 h-20 bg-[#020817] backdrop-blur-xl '>
			<div className='container flex-1 mx-auto flex h-full max-w-7xl items-center justify-between border-b'>
				{/* Logo section */}
				<Link href={`${getLanguagePrefix()}`}>
					<Image
						src={'/logofile1.png'}
						alt='logo'
						width={240}
						height={80}
						className='object-contain'
					/>
				</Link>
				<div className='flex items-center justify-center gap-4'>
					<LanguageSwitcherStudent />
					<div className='flex-1 text-center'>{/* <ModeToggle /> */}</div>
				</div>
			</div>
		</div>
	)
}

export default PracticeNavbar

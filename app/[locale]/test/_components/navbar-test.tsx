'use client'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import React from 'react'

function PracticeNavbar() {
	return (
		<div className='fixed inset-0 z-40 h-20 bg-background/70 backdrop-blur-xl '>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between border-b'>
				{/* Logo section */}
				<h1 className='text-4xl text-blue-500 font-extrabold font-roboto'>
					Avto Maktab
				</h1>
				<div className='flex items-center justify-center gap-4'>
					<div>
						<ModeToggle />
					</div>
					<LanguageSwitcher />
				</div>
			</div>
		</div>
	)
}

export default PracticeNavbar

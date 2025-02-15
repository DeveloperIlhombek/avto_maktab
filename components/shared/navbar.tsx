import { ModeToggle } from '@/components/shared/mode-toggle'
import { navLink } from '@/constanta'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

function Navbar() {
	return (
		<div className='fixed inset-0 z-40 h-20 bg-background/70 backdrop-blur-xl '>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between border-b'>
				{/* Logo section */}
				<h1 className='text-4xl text-blue-500 font-extrabold font-roboto'>
					Avto Maktab
				</h1>
				{/* Navigation section */}
				<div className='flex items-center justify-center gap-4 font-bold font-roboto text-xl'>
					{navLink.map(item => (
						<Link key={item.id} href={item.url}>
							{item.name}
						</Link>
					))}
				</div>
				{/* ModeToggle Lang Kisrish */}
				<div className='flex items-center justify-center gap-4'>
					<div>
						<ModeToggle />
					</div>
					<div>Til tanlash</div>
					<Button variant={'outline'}>Tizimga kirish</Button>
				</div>
			</div>
		</div>
	)
}

export default Navbar

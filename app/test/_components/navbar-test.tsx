import { ModeToggle } from '@/components/shared/mode-toggle'
import { Button } from '@/components/ui/button'
import React from 'react'

function NavbarTest() {
	return (
		<>
			<div className='flex items-center justify-between w-full h-16 border-b'>
				<div>Logo</div>
				<div className='flex justify-start items-center gap-4'>
					<ModeToggle />
					Til tanlash
					<Button>Kirish</Button>
				</div>
			</div>
		</>
	)
}

export default NavbarTest

'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/shared/mode-toggle'

export function Header() {
	return (
		<header className='h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container h-full px-4'>
				<div className='flex h-full items-center justify-between'>
					<div className='font-bold text-2xl text-primary'>E-AVTOMAKTAB</div>

					<div className='flex items-center space-x-4'>
						<div className='relative w-96'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input placeholder='Qidirish...' className='pl-8' />
						</div>
						<ModeToggle />
						<Button size='icon' variant='destructive'>
							Til
						</Button>

						<div className='flex items-center space-x-4'>
							<div className='text-sm'>
								<div className='font-medium'>Admin</div>
								<div className='text-muted-foreground'>admin@avtomaktab.uz</div>
							</div>
							<div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
								<span className='font-medium text-primary'>A</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

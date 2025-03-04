'use client'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { navLink } from '@/constanta'
import Link from 'next/link'
import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from '@/lib/api'
import { useRouter } from 'next/navigation'

function Navbar() {
	const [open, setOpen] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [student_id, setStudent_id] = useState('')
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		try {
			const response = await loginUser({ login, password, student_id })
			localStorage.setItem('token', response.token)
			localStorage.setItem('role', response.role) // Assuming the API returns a role

			alert('Muvaqqiyatli kirdingiz: Token' + response.token)
			setOpen(false)

			// Redirect based on role
			if (response.role === 'admin') {
				router.push('/admin')
			} else if (response.role === 'student') {
				router.push(`/student/${response.student_id}`)
			}
		} catch (error) {
			setError(`Login yoki parol xato: ${error}`)
		}
	}

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
				{/* ModeToggle Lang Kirish */}
				<div className='flex items-center justify-center gap-4'>
					<div>
						<ModeToggle />
					</div>
					<LanguageSwitcher />
					<div className='flex  items-center justify-center gap-4'>
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button className='px-4 py-2 bg-blue-500 text-white rounded-md'>
									Kirish
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Tizimga kirish</DialogTitle>
									<DialogDescription>
										Login va parolni kiriting
									</DialogDescription>
								</DialogHeader>
								<form className='space-y-4' onSubmit={handleLogin}>
									<Input
										type='text'
										placeholder='login'
										className='w-full px-4 py-2 border rounded-md'
										value={login}
										onChange={e => setLogin(e.target.value)}
										required
									/>
									<div className='relative'>
										<Input
											type={showPassword ? 'text' : 'password'}
											placeholder='parol'
											className='w-full px-4 py-2 border rounded-md pr-10'
											value={password}
											onChange={e => setPassword(e.target.value)}
											required
										/>
										<Button
											type='button'
											variant={showPassword ? 'link' : 'secondary'}
											className='absolute inset-y-0 right-2 flex items-center'
											onClick={() => setShowPassword(prev => !prev)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</Button>
									</div>
									{error && <p className='text-red-500'>{error}</p>}
									<Button
										type='submit'
										className='w-full bg-blue-500 text-white py-2 rounded-md'
									>
										Kirish
									</Button>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar

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
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

function Navbar() {
	const t = useTranslations('Kirish')
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
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

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		try {
			const response = await loginUser({ login, password })
			const results = response.result

			localStorage.setItem('token', results.accessToken)
			localStorage.setItem('role', results.user.role.toString())

			// Foydalanuvchini kabinetiga yo'naltirish
			if (results.accessToken && results.user.role && results.user.id) {
				setOpen(false)
				if (results.user.role === 2) {
					router.push(`${getLanguagePrefix()}/instructor/${results.user.id}`)
				} else if (results.user.role === 1) {
					router.push(`${getLanguagePrefix()}/admin`)
				} else {
					router.push(`${getLanguagePrefix()}/student/${results.user.id}`)
				}
			}
		} catch (error) {
			setError(
				`Login yoki parol xato: ${
					error instanceof Error ? error.message : "Noma'lum xatolik"
				}`
			)
		}
	}

	return (
		<div className='fixed inset-0 z-40 h-20 bg-background/70 backdrop-blur-xl '>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between border-b'>
				{/* Logo section */}
				<h1 className='text-4xl text-blue-500 font-extrabold font-roboto'>
					<Link href={`${getLanguagePrefix()}`}>Avto Maktab</Link>
				</h1>
				{/* Navigation section */}
				<div className='flex items-center justify-center gap-4 font-bold font-roboto text-xl'>
					{navLink.map(item => (
						<Link key={item.id} href={item.url}>
							{t(item.name)}
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
								<Button className='px-4 py-2 rounded-md' variant={'custom'}>
									{t('kirish')}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t('tizimgakirish')}</DialogTitle>
									<DialogDescription>
										{t('loginparolkiritish')}
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
										variant={'custom'}
										className='w-full py-2 rounded-md'
									>
										{t('kirish')}
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

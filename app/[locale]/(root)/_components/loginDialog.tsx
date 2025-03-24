'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { GetByusername, loginUser } from '@/lib/api'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function LoginDialog({ trigger }: { trigger: React.ReactNode }) {
	const t = useTranslations('Kirish')
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()

	// Til prefiksini olish
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	// Login funksiyasi
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		try {
			const response = await loginUser({ login, password })
			const results = response.result

			localStorage.setItem('token', results.accessToken)
			localStorage.setItem('role', results.user.role.toString())

			// Foydalanuvchini yo'naltirish
			setOpen(false)
			if (results.user.role === 2) {
				router.push(`${getLanguagePrefix()}/instructor/${results.user.id}`)
			} else if (results.user.role === 1) {
				router.push(`${getLanguagePrefix()}/admin`)
			} else {
				router.push(`${getLanguagePrefix()}/student/${results.user.id}`)
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('tizimgakirish')}</DialogTitle>
					<DialogDescription>{t('loginparolkiritish')}</DialogDescription>
				</DialogHeader>
				<form className='space-y-4' onSubmit={handleLogin}>
					<Input
						type='text'
						placeholder='login'
						value={login}
						onChange={e => setLogin(e.target.value)}
						required
					/>
					<div className='relative'>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder='parol'
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
					<Button type='submit' variant='custom' className='w-full'>
						{t('kirish')}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
export function GetbyusernameDialog({ trigger }: { trigger: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const [login, setLogin] = useState('')
	const [error, setError] = useState<string | null>(null)
	const pathname = usePathname()

	// Til prefiksini olish
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}

	// Login funksiyasi
	const handleLoginByUsername = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		try {
			const enterResult = await GetByusername('Ilhom')
			console.log(enterResult)

			// Foydalanuvchini yo'naltirish
			setOpen(false)
			if (enterResult.role === 2) {
				router.push(`${getLanguagePrefix()}/instructor/${enterResult.id}`)
			} else if (enterResult.role === 1) {
				router.push(`${getLanguagePrefix()}/admin`)
			} else {
				router.push(`${getLanguagePrefix()}/student/${enterResult.id}`)
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>tizimgakirish</DialogTitle>
					<DialogDescription>loginparolkiritish</DialogDescription>
				</DialogHeader>
				<form className='space-y-4' onSubmit={handleLoginByUsername}>
					<Input
						type='text'
						placeholder='login'
						value={login}
						onChange={e => setLogin(e.target.value)}
						required
					/>
					<div className='relative'></div>
					{error && <p className='text-red-500'>{error}</p>}
					<Button type='submit' variant='custom' className='w-full'>
						kirish
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}

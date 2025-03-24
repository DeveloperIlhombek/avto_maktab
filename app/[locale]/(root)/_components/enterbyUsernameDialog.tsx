// 'use client'

// import { useState } from 'react'
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { GetByusername } from '@/lib/api'
// import { usePathname } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// export function StartTestDialog({ trigger }: { trigger: React.ReactNode }) {
// 	const t = useTranslations('Kirish')
// 	const [open, setOpen] = useState(false)
// 	const [username, setUsername] = useState('')
// 	const [error, setError] = useState<string | null>(null)
// 	const pathname = usePathname()

// 	// Til prefiksini olish
// 	const getLanguagePrefix = () => {
// 		const segments = pathname.split('/')
// 		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
// 			return `/${segments[1]}`
// 		}
// 		return ''
// 	}

// 	// Login funksiyasi
// 	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault()
// 		setError(null)
// 		try {
// 			const resultByUsername = await GetByusername(username)
// 			console.log(resultByUsername)
// 		} catch (error) {
// 			setError(
// 				`Login  xato: ${
// 					error instanceof Error ? error.message : "Noma'lum xatolik"
// 				}`
// 			)
// 		}
// 	}

// 	return (
// 		<Dialog open={open} onOpenChange={setOpen}>
// 			<DialogTrigger asChild>{trigger}</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader>
// 					<DialogTitle>{t('tizimgakirish')}</DialogTitle>
// 					<DialogDescription>{t('loginparolkiritish')}</DialogDescription>
// 				</DialogHeader>
// 				<form className='space-y-4' onSubmit={handleLogin}>
// 					<Input
// 						type='text'
// 						placeholder='login'
// 						value={username}
// 						onChange={e => setUsername(e.target.value)}
// 						required
// 					/>

// 					{error && <p className='text-red-500'>{error}</p>}
// 					<Button type='submit' variant='custom' className='w-full'>
// 						{t('kirish')}
// 					</Button>
// 				</form>
// 			</DialogContent>
// 		</Dialog>
// 	)
// }

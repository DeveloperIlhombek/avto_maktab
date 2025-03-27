'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Language = {
	code: string
	name: string
	flag: string
}

const languages: Language[] = [
	{ code: 'uz', name: "O'zbekcha", flag: '/locales/uz.png' },
	{ code: 'uzk', name: 'Ўзбекча', flag: '/locales/uz.png' },
	{ code: 'ru', name: 'Русский', flag: '/locales/ru.png' },
]

export function LanguageSwitcherStudent() {
	const [selectedLanguage, setSelectedLanguage] = useState<Language>(
		languages[0]
	)
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const pathLang = pathname.split('/')[1]
		const matchedLang = languages.find(lang => lang.code === pathLang)
		if (matchedLang) {
			setSelectedLanguage(matchedLang)
		}
	}, [pathname])

	const handleLanguageSelect = (language: Language) => {
		setSelectedLanguage(language)

		const currentPath = pathname
		const pathParts = currentPath.split('/')

		if (languages.some(lang => lang.code === pathParts[1])) {
			pathParts[1] = language.code
			router.push(pathParts.join('/'))
		} else {
			router.push(`/${language.code}${currentPath}`)
		}
	}

	return (
		<div className='flex items-center text-black hover:text-black dark:text-white justify-center p-2 rounded-lg bg-background  dark:bg-[#020817] backdrop-blur-sm  shadow-sm dark:hover:text-white/90'>
			<div className='flex items-center gap-2'>
				{languages.map(language => (
					<motion.button
						key={language.code}
						onClick={() => handleLanguageSelect(language)}
						className={cn(
							'relative flex items-center gap-2 px-1 py-2 rounded-md transition-all duration-300',
							selectedLanguage.code === language.code
								? 'bg-backgroundshadow-sm'
								: 'hover:bg-accent'
						)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						initial={false}
					>
						<div
							className={cn(
								'w-2 h-5 ',
								selectedLanguage.code === language.code
									? 'bg-green-500 border border-green-500'
									: 'hidden'
							)}
						></div>
						<div className='relative w-5 h-5'>
							<Image
								src={language.flag}
								alt={language.name}
								fill
								className='object-cover rounded-sm'
							/>
						</div>

						<span className='text-sm font-medium'>
							{language.name.toUpperCase()}
						</span>

						{selectedLanguage.code === language.code && (
							<motion.div
								className='absolute inset-0 rounded-md bg-primary/10'
								layoutId='activeLanguage'
								transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
							/>
						)}
					</motion.button>
				))}
			</div>
		</div>
	)
}

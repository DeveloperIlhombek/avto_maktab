'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'

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

export function LanguageSwitcher() {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedLanguage, setSelectedLanguage] = useState<Language>(
		languages[0]
	)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathname = usePathname()

	// Set initial language based on URL path
	useEffect(() => {
		const pathLang = pathname.split('/')[1]
		const matchedLang = languages.find(lang => lang.code === pathLang)
		if (matchedLang) {
			setSelectedLanguage(matchedLang)
		}
	}, [pathname])

	//  Dropdownni yopish chetki qismlarni bosgan vaqtda ham
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleLanguageSelect = (language: Language) => {
		setSelectedLanguage(language)
		setIsOpen(false)

		// Change URL path based on selected language
		const currentPath = pathname
		const pathParts = currentPath.split('/')

		// If there's already a language code in the path, replace it
		if (languages.some(lang => lang.code === pathParts[1])) {
			pathParts[1] = language.code
			router.push(pathParts.join('/'))
		} else {
			// Otherwise, add the language code at the beginning
			router.push(`/${language.code}${currentPath}`)
		}
	}

	return (
		<div className='relative' ref={dropdownRef}>
			<motion.button
				className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors'
				onClick={e => {
					e.preventDefault()
					setIsOpen(!isOpen)
				}}
				whileTap={{ scale: 0.97 }}
			>
				<Image
					src={selectedLanguage.flag}
					alt={selectedLanguage.name}
					width={24}
					height={24}
					className='rounded-sm'
				/>
				<span className='font-medium'>
					{selectedLanguage.code.toUpperCase()}
				</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<ChevronDown className='h-4 w-4 opacity-70' />
				</motion.div>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						className='absolute right-0 mt-2 w-48 rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 z-50'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
					>
						<div className='py-1'>
							{languages.map(language => (
								<motion.button
									key={language.code}
									className={cn(
										'flex items-center w-full px-4 py-2 text-left text-sm hover:bg-accent/50 transition-colors',
										selectedLanguage.code === language.code && 'bg-accent/30'
									)}
									onClick={() => handleLanguageSelect(language)}
									whileHover={{ x: 5 }}
									transition={{ type: 'spring', stiffness: 300 }}
								>
									<Image
										src={language.flag}
										alt={language.name}
										width={20}
										height={20}
										className='rounded-sm mr-3'
									/>
									<span className='flex-1'>{language.name}</span>
									{selectedLanguage.code === language.code && (
										<Check className='h-4 w-4 text-primary' />
									)}
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

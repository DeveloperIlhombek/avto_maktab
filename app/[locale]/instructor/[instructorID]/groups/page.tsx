'use client'

import { getGroups, GroupItem } from '@/lib/groups'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, UserCheck, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

function Page() {
	const [allgroup, setAllgroup] = useState<GroupItem[]>([])
	const [isActive, setIsActive] = useState(true)
	const [isDeleted, setIsDeleted] = useState(false)
	const [loading, setLoading] = useState(true)
	const pathname = usePathname()
	const instructorId = pathname.split('/')[3]
	const getLanguagePrefix = () => {
		const segments = pathname.split('/')
		// Check if the first segment after the initial slash is a language code
		if (segments.length > 1 && ['uz', 'uzk', 'ru'].includes(segments[1])) {
			return `/${segments[1]}`
		}
		return ''
	}
	useEffect(() => {
		const fetchAllGroup = async () => {
			try {
				setLoading(true)
				const response = await getGroups({
					pageSize: 1000,
					pageNumber: 0,
					isActive: isActive,
					isDeleted: isDeleted,
				})
				setAllgroup(response.result.items)
			} catch (error) {
				toast.error(`Guruhlarni yuklashda xatolik: ${error}`)
			} finally {
				setLoading(false)
			}
		}
		fetchAllGroup()
	}, [isActive, isDeleted])

	const filterGroup = allgroup.filter(
		group => group.instructorId === instructorId
	)

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	}

	const GroupList = ({ groups }: { groups: GroupItem[] }) => (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
		>
			{groups.map(group => (
				<Link
					key={group.id}
					href={`${getLanguagePrefix()}/instructor/${instructorId}/groups/${
						group.id
					}`}
				>
					<motion.div variants={item}>
						<Card className='border-2 hover:border-primary/50 transition-colors'>
							<CardHeader>
								<CardTitle className='flex items-center justify-between'>
									<span className='text-xl font-semibold'>{group.name}</span>
									<Badge
										variant={
											group.isDeleted
												? 'destructive'
												: group.isActive
												? 'default'
												: 'secondary'
										}
									>
										{group.isDeleted
											? "O'chirilgan"
											: group.isActive
											? 'Faol'
											: 'Nofaol'}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center gap-2 text-muted-foreground'>
									<Users className='h-4 w-4' />
									<span>O&apos;quvchilar soni: 20</span>
								</div>
								<div className='flex items-center gap-2 text-muted-foreground'>
									<Calendar className='h-4 w-4' />
									<span>
										Yaratilgan sana:{' '}
										{new Date(group.createdDate).toLocaleDateString('uz-UZ')}
									</span>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</Link>
			))}
			{groups.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='col-span-full text-center py-12 text-muted-foreground'
				>
					Hozircha guruhlar mavjud emas
				</motion.div>
			)}
		</motion.div>
	)

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
				<div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[1, 2, 3].map(i => (
						<Card key={i} className='border-2'>
							<CardHeader>
								<div className='h-6 w-32 bg-muted animate-pulse rounded' />
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='h-4 w-full bg-muted animate-pulse rounded' />
									<div className='h-4 w-3/4 bg-muted animate-pulse rounded' />
									<div className='h-4 w-1/2 bg-muted animate-pulse rounded' />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8'>
			<div className='max-w-7xl mx-auto space-y-8'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-2'
				>
					<h1 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
						Guruhlar
					</h1>
					<p className='text-muted-foreground'>
						Instruktorga biriktirilgan guruhlar ro&apos;yxati
					</p>
				</motion.div>

				<Tabs defaultValue='active' className='space-y-4'>
					<TabsList className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
						<TabsTrigger
							value='active'
							onClick={() => {
								setIsActive(true)
								setIsDeleted(false)
							}}
						>
							<UserCheck className='h-4 w-4 mr-2' />
							Faol guruhlar
						</TabsTrigger>

						<TabsTrigger
							value='deleted'
							onClick={() => {
								setIsDeleted(true)
							}}
						>
							<Trash2 className='h-4 w-4 mr-2' />
							O&apos;chirilgan guruhlar
						</TabsTrigger>
					</TabsList>

					<TabsContent value='active'>
						<GroupList groups={filterGroup.filter(group => group.isActive)} />
					</TabsContent>

					<TabsContent value='deleted'>
						<GroupList groups={filterGroup.filter(group => group.isDeleted)} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default Page

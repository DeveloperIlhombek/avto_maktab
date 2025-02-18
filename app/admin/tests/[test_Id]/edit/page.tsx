'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import Image from 'next/image'

// Mock data for a single question
const questionData = {
	id: 1,
	question:
		"Qaysi avtomobil uchun bu belgilarning ta'sir oralig'ida to'xtashga ruxsat etiladi?",
	choises: [
		{ text: 'Qizilga', answer: false },
		{ text: 'Ikkala avtomobilga', answer: false },
		{ text: 'Hech qaysi biriga', answer: false },
		{
			text: "<<Nogiron>> taniqlik belgisi bo'lgan sariq avtomobilga",
			answer: true,
		},
	],
	media: { exist: true, name: '1' },
	description:
		"YHQ 1-ilovasi 3-bo'limi 2-xatboshiga asosan, qoidalarning 174-bandiga ko'ra «Nogiron» taniqlik belgisi o'rnatilgan avtomobil va motokolyaskalarni boshqarayotgan nogiron haydovchilar 3.2, 3.3 va 3.28 belgilari talablaridan chetga chiqishlari mumkin. 7.18 qo'shimcha belgisi bo'lganda 3.27 belgisining ta'sir oralig'ida to'xtashga ruxsat etiladi.",
	category: 'B',
	status: 'Faol',
}

const formSchema = z.object({
	question: z.string().min(1, 'Savol matni kiritilishi shart'),
	category: z.string().min(1, 'Toifani tanlang'),
	description: z.string().min(1, 'Savol izohi kiritilishi shart'),
	status: z.string().min(1, 'Statusni tanlang'),
	choices: z
		.array(
			z.object({
				text: z.string().min(1, 'Javob varianti kiritilishi shart'),
				answer: z.boolean(),
			})
		)
		.min(2, "Kamida 2 ta javob varianti bo'lishi kerak"),
})

export default function EditQuestion() {
	const { id } = useParams()
	const router = useRouter()
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		questionData.media.exist
			? `/images/questions/${questionData.media.name}.jpg`
			: null
	)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			question: questionData.question,
			category: questionData.category,
			description: questionData.description,
			status: questionData.status,
			choices: questionData.choises,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
		console.log('Selected Image:', selectedImage)
		// Here you would typically make an API call to update the question
		router.push(`/admin/tests/${id}`)
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedImage(file)
			const url = URL.createObjectURL(file)
			setPreviewUrl(url)
		}
	}

	const removeImage = () => {
		setSelectedImage(null)
		setPreviewUrl(null)
		const input = document.getElementById('image-upload') as HTMLInputElement
		if (input) {
			input.value = ''
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<Link href={`/admin/tests/${id}`}>
					<Button variant='ghost' size='icon'>
						<ArrowLeft className='h-4 w-4' />
					</Button>
				</Link>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						Savolni tahrirlash
					</h2>
					<p className='text-muted-foreground'>
						Savol ma&apos;lumotlarini yangilash
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card className='md:col-span-2'>
					<CardHeader>
						<CardTitle>Savol ma&apos;lumotlari</CardTitle>
						<CardDescription>
							Ushbu formani to&apos;ldirish orqali savol ma&apos;lumotlarini
							yangilang
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-8'
							>
								<div className='grid grid-cols-1 gap-6'>
									<FormField
										control={form.control}
										name='question'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Savol matni</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Savol matnini kiriting'
														className='resize-none'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className='grid grid-cols-2 gap-4'>
										<FormField
											control={form.control}
											name='category'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Toifa</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Toifani tanlang' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='A'>A toifa</SelectItem>
															<SelectItem value='B'>B toifa</SelectItem>
															<SelectItem value='C'>C toifa</SelectItem>
															<SelectItem value='D'>D toifa</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='status'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Status</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Statusni tanlang' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='Faol'>Faol</SelectItem>
															<SelectItem value='Nofaol'>Nofaol</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name='description'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Savol izohi</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Savol haqida qo'shimcha ma'lumot kiriting"
														className='resize-none min-h-[100px]'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Choices Fields */}
									<div className='space-y-4'>
										<FormLabel>Javob variantlari</FormLabel>
										{form.watch('choices')?.map((_, index) => (
											<div
												key={index}
												className='grid grid-cols-[1fr,auto] gap-4 items-start'
											>
												<FormField
													control={form.control}
													name={`choices.${index}.text`}
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input
																	placeholder={`${index + 1}-javob varianti`}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`choices.${index}.answer`}
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input
																	type='radio'
																	className='w-4 h-4 mt-3'
																	checked={field.value}
																	onChange={() => {
																		form.watch('choices').forEach((_, i) => {
																			form.setValue(
																				`choices.${i}.answer`,
																				false
																			)
																		})
																		form.setValue(
																			`choices.${index}.answer`,
																			true
																		)
																	}}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
										))}
									</div>
								</div>

								<div className='flex justify-end gap-4'>
									<Link href={`/admin/tests/${id}`}>
										<Button variant='outline'>Bekor qilish</Button>
									</Link>
									<Button type='submit'>Saqlash</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Image Upload Card */}
				<Card>
					<CardHeader>
						<CardTitle>Savol rasmi</CardTitle>
						<CardDescription>
							Savol uchun rasm yuklang yoki mavjud rasmni o&apos;zgartiring
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{previewUrl ? (
								<div className='relative'>
									<Image
										src={previewUrl}
										alt='Question preview'
										width={500}
										height={500}
										className='w-full h-auto rounded-lg'
									/>
									<Button
										variant='destructive'
										size='icon'
										className='absolute top-2 right-2'
										onClick={removeImage}
									>
										<X className='h-4 w-4' />
									</Button>
								</div>
							) : (
								<div className='border-2 border-dashed rounded-lg p-4 text-center'>
									<Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
									<p className='text-sm text-muted-foreground'>
										Rasm yuklash uchun bosing yoki shu yerga tashlang
									</p>
								</div>
							)}
							<Input
								id='image-upload'
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								className={previewUrl ? 'hidden' : ''}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

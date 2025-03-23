/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { useEffect } from 'react'

interface LanguageTabProps {
	lang: 'uz' | 'uzk' | 'ru'
	form: UseFormReturn<any>
	removeAnswer: (index: number) => void
}

const labels = {
	uz: {
		question: 'Savol matni',
		questionPlaceholder: 'Savolni kiriting',
		explanation: 'Izoh',
		explanationPlaceholder: 'Izohni kiriting',
		correctAnswer: "To'g'ri javob",
		variant: 'variant',
	},
	uzk: {
		question: 'Савол матни',
		questionPlaceholder: 'Саволни киритинг',
		explanation: 'Изоҳ',
		explanationPlaceholder: 'Изоҳни киритинг',
		correctAnswer: 'Тўғри жавоб',
		variant: 'вариант',
	},
	ru: {
		question: 'Текст вопроса',
		questionPlaceholder: 'Введите вопрос',
		explanation: 'Объяснение',
		explanationPlaceholder: 'Введите объяснение',
		correctAnswer: 'Правильный ответ',
		variant: 'вариант',
	},
}

export function LanguageTab({ lang, form, removeAnswer }: LanguageTabProps) {
	const answers = useWatch({ control: form.control, name: 'Answers' }) || []

	// Oldindan kiritilgan variantlarni formga yuklash
	useEffect(() => {
		const existingAnswers = form.getValues('Answers')
		if (!existingAnswers || existingAnswers.length === 0) {
			form.setValue('Answers', [{ answerText: '', isCorrect: false }])
		}
	}, [form])

	return (
		<div className='space-y-4'>
			{/* SAVOL INPUT */}
			<FormField
				control={form.control}
				name={`Question${lang.toUpperCase()}`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{labels[lang].question}</FormLabel>
						<FormControl>
							<Textarea
								placeholder={labels[lang].questionPlaceholder}
								className='min-h-[100px]'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* IZOHLAR INPUT */}
			<FormField
				control={form.control}
				name={`Explanation${lang.toUpperCase()}`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{labels[lang].explanation}</FormLabel>
						<FormControl>
							<Textarea
								placeholder={labels[lang].explanationPlaceholder}
								className='min-h-[100px]'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* VARIANTLAR RO'YXATI */}
			<AnimatePresence>
				{answers.map((answer: any, index: number) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						<FormField
							control={form.control}
							name={`Answers.${index}.answerText${lang.toUpperCase()}`}
							render={({ field }) => (
								<FormItem>
									<div className='flex items-center gap-4'>
										<FormControl>
											<Input
												placeholder={`${index + 1}-${labels[lang].variant}`}
												{...field}
												defaultValue={
													answer?.[`answerText${lang.toUpperCase()}`] || ''
												}
											/>
										</FormControl>
										{/* TO'G'RI JAVOBNI BELGILASH */}
										<FormField
											control={form.control}
											name={`Answers.${index}.isCorrect`}
											render={({ field: radioField }) => (
												<FormItem>
													<div className='flex items-center gap-2'>
														<FormControl>
															<Input
																type='radio'
																className='w-4 h-4'
																checked={radioField.value}
																onChange={() => {
																	// Barcha variantlarning isCorrect ni false qilish va faqat bittasini true qilish
																	const updatedAnswers = answers.map(
																		(a: any, i: number) => ({
																			...a,
																			isCorrect: i === index,
																		})
																	)
																	form.setValue('Answers', updatedAnswers)
																}}
															/>
														</FormControl>
														<span className='text-sm text-muted-foreground'>
															{labels[lang].correctAnswer}
														</span>
														{/* O'CHIRISH TUGMASI */}
														<Button
															type='button'
															variant='destructive'
															size='sm'
															onClick={() => removeAnswer(index)}
															disabled={answers.length <= 2}
														>
															<X className='h-4 w-4' />
														</Button>
													</div>
												</FormItem>
											)}
										/>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

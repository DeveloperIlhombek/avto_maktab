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
import { UseFormReturn } from 'react-hook-form'

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
	return (
		<div className='space-y-4'>
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

			<AnimatePresence>
				{form.getValues('Answers').map((_: any, index: number) => (
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
											/>
										</FormControl>
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
																	const answers = form.getValues('Answers')
																	answers.forEach((_: any, i: number) => {
																		form.setValue(
																			`Answers.${i}.isCorrect`,
																			i === index
																		)
																	})
																}}
															/>
														</FormControl>
														<span className='text-sm text-muted-foreground'>
															{labels[lang].correctAnswer}
														</span>
														<Button
															type='button'
															variant='destructive'
															size='sm'
															onClick={() => removeAnswer(index)}
															disabled={form.getValues('Answers').length <= 2}
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

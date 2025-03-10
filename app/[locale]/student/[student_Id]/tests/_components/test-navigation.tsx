// 'use client'

// import { Button } from '@/components/ui/button'
// import { motion } from 'framer-motion'
// import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
// import type { Test } from '@/lib/test'

// interface TestNavigationProps {
// 	currentQuestion: number
// 	totalQuestions: number
// 	pageNumber: number
// 	currentPage: number
// 	answers: number[]
// 	isCompleted: boolean
// 	questions: Test[] // Barcha savollar (allQuestions)
// 	onQuestionChange: (index: number) => void
// 	onPageNumberChange: (index: number) => void
// }

// export function TestNavigation({
// 	currentQuestion,
// 	totalQuestions,
// 	answers,
// 	isCompleted,
// 	pageNumber,
// 	currentPage,
// 	questions,
// 	onQuestionChange,
// 	onPageNumberChange,
// }: TestNavigationProps) {
// 	const handlePageChange = (newPage: number) => {
// 		onPageNumberChange(newPage)
// 	}

// 	const startIndex = currentPage * 20
// 	const endIndex = Math.min(startIndex + 20, totalQuestions)

// 	return (
// 		<div className='space-y-4'>
// 			<div className='flex items-center justify-center gap-2 flex-wrap'>
// 				<Button
// 					onClick={() => handlePageChange(currentPage - 1)}
// 					disabled={currentPage === 0}
// 				>
// 					Avvalgi 20
// 				</Button>
// 				{Array.from({ length: endIndex - startIndex }).map((_, index) => {
// 					const questionIndex = startIndex + index
// 					const answer = answers[questionIndex]
// 					const isCorrect =
// 						answer !== null &&
// 						questions[questionIndex].testAnswersForUser?.[answer]?.isCorrect // questionIndex dan foydalaning

// 					return (
// 						<motion.button
// 							key={questionIndex}
// 							whileHover={{ scale: 1.05 }}
// 							whileTap={{ scale: 0.95 }}
// 							onClick={() => onQuestionChange(questionIndex)}
// 							className={`
//                 w-10 h-10 rounded-lg flex items-center justify-center
//                 ${
// 									currentQuestion === questionIndex
// 										? 'bg-primary text-primary-foreground'
// 										: 'bg-secondary'
// 								}
//                 ${
// 									isCompleted && answer !== null
// 										? isCorrect
// 											? 'bg-green-500/10 text-green-500'
// 											: 'bg-red-500/10 text-red-500'
// 										: ''
// 								}
//                 ${answer !== null ? 'font-bold' : ''}
//                 transition-colors
//               `}
// 						>
// 							{isCompleted && answer !== null ? (
// 								isCorrect ? (
// 									<CheckCircle className='w-5 h-5' />
// 								) : (
// 									<XCircle className='w-5 h-5' />
// 								)
// 							) : (
// 								questionIndex + 1
// 							)}
// 						</motion.button>
// 					)
// 				})}
// 				<Button
// 					onClick={() => handlePageChange(currentPage + 1)}
// 					disabled={currentPage === pageNumber - 1}
// 				>
// 					Keyingi 20
// 				</Button>
// 			</div>

// 			<div className='flex justify-between'>
// 				<Button
// 					variant='outline'
// 					onClick={() => onQuestionChange(currentQuestion - 1)}
// 					disabled={currentQuestion === 0}
// 				>
// 					<ChevronLeft className='mr-2 h-4 w-4' />
// 					Oldingi savol
// 				</Button>
// 				<Button
// 					onClick={() => onQuestionChange(currentQuestion + 1)}
// 					disabled={currentQuestion === totalQuestions - 1}
// 				>
// 					Keyingi savol
// 					<ChevronRight className='ml-2 h-4 w-4' />
// 				</Button>
// 			</div>
// 		</div>
// 	)
// }

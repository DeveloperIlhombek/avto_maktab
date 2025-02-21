import { useState, useEffect } from 'react'
import { getAllTests } from '@/app.ts'

export default function TestPage() {
	const [tests, setTests] = useState([])

	useEffect(() => {
		const fetchTests = async () => {
			const data = await getAllTests()
			if (data) {
				setTests(data)
			}
		}

		fetchTests()
	}, [])

	return (
		<div>
			<h1>Testlar</h1>
			<ul>
				{tests.map((test, index) => (
					<li key={index}>{test.name}</li> // Test ma'lumotlarini ko'rsatish
				))}
			</ul>
		</div>
	)
}

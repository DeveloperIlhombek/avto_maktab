import { getAllTests } from '@/lib/api'
import Test from './_components/test'

export default async function TestPage() {
	const data = await getAllTests()

	if (!data) {
		return <div>Error loading tests</div>
	}

	return <Test response={data.result} />
}

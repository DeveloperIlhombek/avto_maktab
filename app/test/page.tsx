import { getAllTests } from '@/lib/api'
import Test from './_components/test'

interface PageParams {
	lang: string
}

export default async function TestPage({ params }: { params: PageParams }) {
	const { lang } = params
	// console.log(lang)
	// console.log(111111)

	const data = await getAllTests({
		pageSize: 728,
		pageNumber: 0,
		language: lang,
	})

	if (!data) {
		return <div>Error loading tests</div>
	}

	return <Test response={data.result} />
}

import { getAllTests } from '@/lib/api'
import Test from './_components/test'

export default async function TestPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const data = await getAllTests({
		pageSize: 720,
		pageNumber: 2,
		language: locale,
	})

	if (!data) {
		return <div>Error loading tests</div>
	}

	return <Test response={data.result} language={locale} />
}

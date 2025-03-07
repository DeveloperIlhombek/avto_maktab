import { getAllTests } from '@/lib/test'
import Test from './_components/test'

export default async function TestPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const data = await getAllTests({
		pageSize: 700,
		pageNumber: 0,
		language: locale,
	})

	if (!data) {
		return <div>Error loading tests</div>
	}

	return <Test response={data.result} language={locale} />
}

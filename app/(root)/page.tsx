import React from 'react'
import Hero from './_components/hero'
import { Opportunities } from './_components/opportunities'
import { Functions } from './_components/functions'
import { Statistics } from './_components/statistics'
import { Contact } from './_components/contact'
import { Test } from './_components/test'
import { getAllTests } from '@/lib/api'

function Page() {
	return (
		<>
			<Hero />
			<Opportunities />
			<Functions />
			<Statistics />
			<Test />
			<Contact />
			{getAllTests.length}
		</>
	)
}

export default Page

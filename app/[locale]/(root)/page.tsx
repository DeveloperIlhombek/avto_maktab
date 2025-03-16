'use cleint'
import React from 'react'
import Hero from './_components/hero'
import { Opportunities } from './_components/opportunities'
import { Functions } from './_components/functions'
//import { Statistics } from './_components/statistics'
import { Test } from './_components/test'

function Page() {
	return (
		<>
			<div className='mt-24'></div>
			<Hero />
			<Opportunities />
			<Functions />
			<Test />
		</>
	)
}

export default Page

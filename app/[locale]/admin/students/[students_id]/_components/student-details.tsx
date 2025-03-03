// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft } from 'lucide-react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { TabIcons } from './tab-icons'
// import { ProfileCard } from './profile-card'
// import { OverviewTab } from './overview-tab'
// import { EducationTab } from './education-tab'
// import { TestsTab } from './tests-tab'
// import { PaymentsTab } from './payments-tab'
// import { PracticeTab } from './practice-tab'
// import { useParams } from 'next/navigation'

// export default function StudentDetails() {
//   const { id } = useParams()
//   const [activeTab, setActiveTab] = useState('overview')

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <Link href='/admin/students'>
//             <Button variant='ghost' size='icon'>
//               <ArrowLeft className='h-4 w-4' />
//             </Button>
//           </Link>
//           <h2 className='text-3xl font-bold tracking-tight'>
//             O&apos;quvchi ma&apos;lumotlari
//           </h2>
//         </div>
//         <Button>Tahrirlash</Button>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
//         <ProfileCard userId={id as string} />

//         <div className='md:col-span-3 space-y-6'>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList>
//               {TabIcons.map((tab) => (
//                 <TabsTrigger key={tab.value} value={tab.value} className='gap-2'>
//                   <tab.icon className='h-4 w-4' />
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             <TabsContent value='overview'>
//               <OverviewTab userId={id as string} />
//             </TabsContent>

//             <TabsContent value='education'>
//               <EducationTab />
//             </TabsContent>

//             <TabsContent value='tests'>
//               <TestsTab />
//             </TabsContent>

//             <TabsContent value='payments'>
//               <PaymentsTab />
//             </TabsContent>

//             <TabsContent value='practice'>
//               <PracticeTab />
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }

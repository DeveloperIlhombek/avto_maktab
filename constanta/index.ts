export const navLink = [
	{
		id: 1,
		name: 'Imkoniyatlar',
		url: '#imkoniyatlar',
	},
	{
		id: 2,
		name: 'Funksiyalar',
		url: '#funksiyalar',
	},
	{
		id: 3,
		name: 'Statistika',
		url: '#statistika',
	},
	{
		id: 4,
		name: "Bog'lanish",
		url: '#boglanish',
	},
	{
		id: 5,
		name: 'Test sinovi',
		url: '#test-sinovi',
	},
	{
		id: 6,
		name: 'Savollar',
		url: '#savollar',
	},
]

export const studentData = {
	id: 1,
	name: 'Aziz Rahimov',
	email: 'aziz@gmail.com',
	phone: '+998 90 123 45 67',
	address: 'Samarqand sh., Jomboy tumani',
	birthDate: '15/05/1995',
	registrationDate: '15/02/2024',
	category: 'B',
	instructor: 'Akmal Karimov',
	totalPayment: 3000000,
	paidAmount: 2000000,
	remainingAmount: 1000000,
	progress: 60,
	status: 'Faol',
	testResults: [
		{ date: '2024-02-20', score: 17, total: 20, status: "O'tdi" },
		{ date: '2024-02-15', score: 18, total: 20, status: "O'tdi" },
		{ date: '2024-02-10', score: 19, total: 20, status: "O'tmadi" },
	],
	practicalLessons: [
		{ date: '2024-02-22', topic: 'Parallel parking', status: 'Bajarildi' },
		{ date: '2024-02-20', topic: 'City driving', status: 'Bajarildi' },
		{
			date: '2024-02-18',
			topic: 'Highway driving',
			status: 'Rejalashtirilgan',
		},
	],
	payments: [
		{ date: '2024-02-15', amount: 1000000, type: 'Naqd' },
		{ date: '2024-02-01', amount: 1000000, type: 'Plastik karta' },
	],
}

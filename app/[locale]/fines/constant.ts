export interface Fine {
	article: string
	description: string
	fine_amount: string
	bhm: string | number
}

export const allFines: Fine[] = [
	{
		article: '125-modda, 1-qism',
		description:
			"Haydovchilarning transport vositalarini boshqarishda va yo'lovchilarni tashishda xavfsizlik kamarlaridan foydalanish qoidalariga rioya qilmaslik, shuningdek, mototsikl haydovchilarining motoshlemalardan foydalanish qoidalariga rioya qilmaslik.",
		fine_amount: "187 500 so'm",
		bhm: 0.5,
	},
	{
		article: '125-modda, 2-qism',
		description:
			"Belgilangan tartibda roʻyxatdan oʻtkazilmagan, majburiy texnik koʻrikdan oʻtmagan, nosozliklari boʻlgan, yongʻin oʻchirish moslamasi, birinchi tibbiy yordam toʻplami, avariya belgisi va jilet bilan jihozlanmagan, shuningdek chiqindilardagi ifloslantiruvchi moddalar miqdori va yaratilgan shovqin darajasi belgilangan me'yorlardan oshib ketadigan boʻlsa.",
		fine_amount: "187 500 so'm",
		bhm: 0.5,
	},
	{
		article: '125-modda, 3-qism',
		description:
			'Tormoz tizimi, rul boshqaruvi yoki ulagich ishlamay qolgan yoki tegishli ruxsatnomasiz qayta jihozlangan transport vositalarini haydovchilarni boshqarish.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '125-modda, 4-qism',
		description:
			'Shaharlararo va xalqaro yo‘lovchi tashishni amalga oshiruvchi avtobuslarni boshqaruv moslamalari (taxograflari)siz yoki taxograflari o‘chirilgan holda boshqarayotgan haydovchilar.',
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '125-modda, 5-qism',
		description:
			"Belgilangan tartibda foydalanish taqiqlangan transport vositalarini, shuningdek davlat raqamlari o'zboshimchalik bilan olib tashlangan transport vositalarini boshqarish.",
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '125-modda, 6-qism',
		description:
			"Soxta yoki boshqacha tarzda o'zgartirilgan davlat raqamlari, shuningdek ushbu transport vositasiga tegishli bo'lmagan davlat raqamlari bilan transport vositalarini boshqarish.",
		fine_amount: "3 750 000 so'm",
		bhm: 10,
	},
	{
		article: '125-1-modda, 1-qism',
		description:
			'Yuklarni tashish qoidalarini buzish, shuningdek, shatakka olish qoidalarini buzish.',
		fine_amount: "3 750 000 so'm",
		bhm: 10,
	},
	{
		article: '125-1-modda, 2-qism',
		description:
			"Og'ir, katta hajimli, xavfli yuklarni tashish va gabarit o'lchamlari yuk bilan yoki yuksiz belgilangan me'yorlardan ortiq bo'lgan transport vositalarida tegishli ruxsatnomasiz yo'lda haydash.",
		fine_amount: "3 750 000 - 5 625 000 so'm",
		bhm: '10 - 15',
	},
	{
		article: '126-modda, 1-qism',
		description:
			"Texnik reglamentga muvofiq bo'lmagan oynali va (yoki) rangli (qoraytirilgan) oynali transport vositalarining, shuningdek, qo‘shimcha buyumlar o‘rnatilgan yoki haydovchi o‘rindig‘idan ko‘rib chiqishni cheklaydigan qoplamalar qo‘yilgan transport vositalarining ishlashi.",
		fine_amount: "9 375 000 so'm",
		bhm: 25,
	},
	{
		article: '126-modda, 2-qism',
		description:
			"Xuddi shunday huquqbuzarlik ma'muriy jazo qo'llanilganidan keyin bir yil davomida takror sodir etilgan bo'lsa.",
		fine_amount: "15 000 000 so'm",
		bhm: 40,
	},
	{
		article: '127-modda, 1-qism',
		description:
			'Ovozli signalni maqsadsiz etkazib berish, ishlab chiqaruvchi tomonidan ko‘zda tutilmagan ovozli va yorug‘lik moslamalarini transport vositalariga o‘rnatish, shuningdek ularni qayta qurish.',
		fine_amount: "375 000 - 1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '127-modda, 2-qism',
		description:
			'Tegishli ruxsatisiz transport vositalariga maxsus ovoz va yorug‘lik moslamalarini o‘rnatish.',
		fine_amount: "375 000 - 1 875 000 so'm",
		bhm: '1 - 5',
	},
	{
		article: '128-modda',
		description:
			'Haydovchilar tomonidan piyodalar yo‘laklarida, piyodalar va velosiped yo‘llarida, yashil maydonlarda haydash, jamoat transporti vositalarining to‘xtash joylaridan qoidalarni buzib o‘tish, tashqi yoritish moslamalaridan foydalanishi, shuningdek, piyodalarga loy sachratish.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '128-1-modda, 1-qism',
		description:
			"Avtotransport vositasini boshqarish paytida haydovchilardan telefondan foydalanish (naushniklar va qurilmalar orqali qo'llarni ishlatmasdan muzokaralar olib borishga ruxsat berishdan tashqari).",
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '128-2-modda, 1-qism',
		description:
			'Tele, video dasturlarni ko‘rish va monitorni (displeyni) transport vositasida ruxsatsiz o‘rnatish uchun transport vositasini boshqarish paytida monitordan (displeydan) foydalanish.',
		fine_amount: "750 000 so'm",
		bhm: 1,
	},
	{
		article: '128-3-modda, 1-qism',
		description:
			'Transport vositalari haydovchilari tomonidan belgilangan harakat tezligi soatiga 20 kilometrdan oshmasligi kerak.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '128-3-modda, 2-qism',
		description:
			'Avtotransport vositalari haydovchilari tomonidan belgilangan harakat tezligini soatiga 20 kilometrdan ortiq, lekin 40 kilometrdan ko‘p bo‘lmagan miqdorda.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '128-3-modda, 3-qism',
		description:
			'Avtotransport vositalari haydovchilari tomonidan belgilangan harakat tezligini soatiga 40 kilometrdan ortiq, lekin 60 kilometrdan ko‘p bo‘lmagan miqdorda.',
		fine_amount: "3 375 000 so'm",
		bhm: 9,
	},
	{
		article: '128-3-modda, 4-qism',
		description:
			'Avtotransport vositalari haydovchilari tomonidan belgilangan harakat tezligini soatiga 60 kilometrdan ortiq bo‘lmagan miqdorda.',
		fine_amount: "5 625 000 so'm",
		bhm: 15,
	},
	{
		article: '128-4-modda, 1-qism',
		description:
			'Transport vositalarining haydovchilari tomonidan svetoforning taqiqlangan signaliga yoki yo‘l harakati nazoratchisining taqiqlangan ishorasiga o‘tish.',
		fine_amount: "187 500 so'm",
		bhm: 0.5,
	},
	{
		article: '128-4-modda, 2-qism',
		description:
			'Avtotransport vositalarining haydovchilari tomonidan to‘siqsiz harakatlanish huquqidan foydalanadigan transport vositalarining o‘tishiga xalaqit berish.',
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '128-5-modda, 1-qism',
		description:
			'Haydovchilar tomonidan yo‘l harakati qoidalarini buzgan holda yo‘lning yon tomoniga yoki qarama-qarshi harakatlanish uchun mo‘ljallangan bo‘lakka transport vositalarining chiqib ketishi, shuningdek ular tomonidan favqulodda vaziyat yuzaga kelgan, ya‘ni boshqa yo‘l foydalanuvchilarini tezlikni, yo‘nalishni keskin o‘zgartirishga majbur qilgan huquqbuzarlik sodir etilishi.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '128-5-modda, 2-qism',
		description:
			'Ushbu moddaning birinchi yoki ikkinchi qismlarida nazarda tutilgan huquqbuzarliklarni ma‘muriy jazo qo‘llanilganidan keyin bir yil ichida takroran sodir etish.',
		fine_amount: "3 750 000 so'm",
		bhm: 10,
	},
	{
		article: '128-5-modda, 3-qism',
		description:
			'Avtotransport vositalarining haydovchilari tomonidan to‘xtash yoki to‘xtash qoidalarini buzish.',
		fine_amount: "7 440 000 so'm",
		bhm: 20,
	},
	{
		article: '128-6-modda, 1-qism',
		description:
			'Yo‘nalishli va maxsus transport vositalari uchun alohida ajratilgan tasmasi bor yo‘ldan transport vositalarining harakatlanishi.',
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '128-6-modda, 2-qism',
		description:
			'Ushbu moddaning birinchi qismida nazarda tutilgan xuddi shunday huquqbuzarlikni ma‘muriy jazo qo‘llanilganidan keyin bir yil davomida takror sodir etish.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '128-6-modda, 3-qism',
		description:
			'Ushbu moddaning birinchi qismida nazarda tutilgan xuddi shunday huquqbuzarlikni ikki marta ma‘muriy jazo qo‘llanilganidan keyin bir yil davomida takror sodir etish.',
		fine_amount: "3 750 000 so'm",
		bhm: 10,
	},
	{
		article: '128-6-modda, 4-qism',
		description:
			'Ushbu moddaning birinchi qismida nazarda tutilgan bir xil huquqbuzarlikni uch va undan ortiq ma‘muriy jazo qo‘llanilganidan keyin bir yil ichida takroran sodir etish.',
		fine_amount: "5 625 000 so'm",
		bhm: 15,
	},
	{
		article: '128-7-modda, 1-qism',
		description:
			'Mototsikl va boshqa transport vositalari haydovchilarining yo‘l harakati xavfsizligi yoki favqulodda vaziyatga tahdid soladigan yo‘llarda guruh harakatida ishtirok etishi.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '128-7-modda, 2-qism',
		description:
			'Xuddi shunday huquqbuzarlik ma‘muriy jazo qo‘llanilganidan keyin bir yil davomida takror sodir etilgan bo‘lsa.',
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '129-modda, 1-qism',
		description:
			'Avtomobil haydovchilari tomonidan temir yo‘l kesishmalaridan o‘tish qoidalarini buzish.',
		fine_amount: "1 125 000 so'm",
		bhm: 3,
	},
	{
		article: '129-modda, 2-qism',
		description:
			'Xuddi shu huquqbuzarlik ma‘muriy jazo qo‘llanilgandan keyin bir yil ichida qayta sodir etilgan.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '130-modda',
		description:
			'Transport vositasini boshqarishni alkogol, giyohvandlik yoki boshqa mastlik holatida bo‘lgan shaxsga o‘tkazish.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '131-modda, 3-qism',
		description:
			'Transport vositalari haydovchilari tomonidan jabrlanuvchiga engil tan jarohati yoki jiddiy moddiy zarar etkazilishiga olib keladigan yo‘l harakati qoidalarini buzish.',
		fine_amount: "9 375 000 so'm",
		bhm: 25,
	},
	{
		article: '133-modda',
		description:
			'Avtotransport vositalarining haydovchilari tomonidan transport vositalariga, transport vositalarini tartibga solish vositalariga yoki boshqa mol-mulkka jiddiy moddiy zarar etkazmagan yo‘l harakati qoidalarini buzish.',
		fine_amount: "1 875 000 - 2 625 000 so'm",
		bhm: '5 - 7',
	},
	{
		article: '134-modda',
		description:
			'Haydovchilar tomonidan transport vositalarini boshqarish huquqini beruvchi hujjatlari, transport vositasini ro‘yxatdan o‘tkazish, shuningdek transport vositasiga egalik qilish, undan foydalanish yoki uni tasarruf etish huquqini tasdiqlovchi hujjatlari, uning egasi yo‘qligida sug‘urta polisi bo‘lmagan haydovchilar tomonidan boshqarilishi.',
		fine_amount: "750 000 - 1 500 000 so'm",
		bhm: '2 - 4',
	},
	{
		article: '135-modda, 1-qism',
		description:
			'Ushbu vositalarni boshqarish huquqiga ega bo‘lmagan shaxslar tomonidan transport vositalarini boshqarish, shuningdek transport vositalarini boshqarishni boshqarish huquqiga ega bo‘lmagan shaxsga o‘tkazish.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '135-modda, 2-qism',
		description:
			'Ushbu huquqdan mahrum bo‘lgan shaxslar tomonidan transport vositalarini boshqarish.',
		fine_amount: "1 875 000 so'm",
		bhm: 5,
	},
	{
		article: '135-modda, 3-qism',
		description:
			'Avtotransport vositalarini ulardan foydalanish davrida boshqarish, transport vositalari egalarining fuqarolik javobgarligini majburiy sug‘urtalash bo‘yicha sug‘urta polislarida nazarda tutilmagan, shuningdek ushbu sug‘urta polislarida nazarda tutilgan ushbu transport vositalarini boshqarish shartlari buzilgan holda transport vositalarini boshqarish faqat ushbu sug‘urta polislarida ko‘rsatilgan haydovchilar tomonidan.',
		fine_amount: "3 750 000 so'm",
		bhm: 10,
	},
	{
		article: '135-1-modda, 1-qism',
		description:
			'Transport vositalari egalari tomonidan fuqarolik javobgarligini majburiy sug‘urta qilish bo‘yicha qonunda belgilangan majburiyatlarni bajarmaslik, shuningdek, bunday majburiy sug‘urta aniq bo‘lmasa, transport vositalarini boshqarish.',
		fine_amount: "187 500 so'm",
		bhm: 0.5,
	},
	{
		article: '135-1-modda, 2-qism',
		description:
			'Yo‘l-transport hodisasi joyining belgilangan qoidalarini buzgan holda ishtirokchilar tomonidan tark etish.',
		fine_amount: "187 500 - 750 000 so'm",
		bhm: '0.5 - 2',
	},
	{
		article: '137-modda, 1-qism',
		description:
			'Agar ushbu yo‘l-transport hodisasi jabrlanuvchiga engil tan jarohati etkazilishiga yoki jiddiy moddiy zarar etkazilishiga olib kelgan bo‘lsa, uning ishtirokchilari tomonidan yo‘l-transport hodisasi sodir bo‘lgan joyning belgilangan qoidalarini buzgan holda qoldirish.',
		fine_amount: "5 625 000 so'm",
		bhm: 15,
	},
	{
		article: '137-modda, 2-qism',
		description:
			'Piyodalar tomonidan yo‘l harakati qoidalarini tartibga solish signallariga bo‘ysunmaslik, ular tomonidan noma‘lum joylarda qatnov qismini kesib o‘tish, shuningdek yo‘l harakati qoidalarini tartibga solish signallariga bo‘ysunmaslik, mopedlar va velosipedlarni boshqaradigan shaxslar, aravachalar va yo‘llardan foydalanadigan boshqa shaxslar tomonidan yo‘l belgilarini taqiqlovchi yoki belgilaydigan ustuvor yo‘l belgilari talablariga rioya qilmaslik.',
		fine_amount: "11 250 000 so'm",
		bhm: 30,
	},
	{
		article: '138-modda',
		description:
			'Avtomobil harakatlanayotganda yo‘lovchining tana qismlarini (qo‘llardan tashqari) salondan chiqarib yuborishi.',
		fine_amount: "125 000 so'm",
		bhm: 0.3,
	},
	{
		article: '138-modda, 4-qism',
		description:
			'Spirtli ichimliklar, giyohvandlik yoki boshqa mast bo‘lgan haydovchilar yoki transport vositalarini boshqarish huquqiga ega bo‘lmagan shaxslar uchun transport vositalarini boshqarishga kirish.',
		fine_amount: "375 000 so'm",
		bhm: 1,
	},
	{
		article: '140-modda',
		description:
			'Yo‘llarga, temir yo‘l kesishmalariga, boshqa inshootlarga yoki yo‘l harakatini tartibga solishning texnik vositalariga zarar yetkazish, shuningdek yo‘l harakati uchun qasddan to‘sqinlik qilish, shu jumladan yo‘l qoplamasini ifloslantirish yo‘li bilan, shuningdek avtomobil yo‘llarini o‘zboshimchalik bilan qazish, ularda sun‘iy usulsüzlükler va to‘siqlar qurish, avtomobil yo‘lida ishlarni amalga oshirish uchun berilgan ruxsatnoma talablariga rioya qilmaslik, shuningdek, yo‘llarni saqlash qoidalarini buzish.',
		fine_amount: "5 625 000 so'm",
		bhm: 15,
	},
	{
		article: '147-modda',
		description:
			'Yo‘l harakati qoidalarini buzish bilan bog‘liq boshqa huquqbuzarliklar.',
		fine_amount: "750 000 - 3 750 000 so'm",
		bhm: '2 - 10',
	},
]

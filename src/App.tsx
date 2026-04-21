import { useState, useEffect, useRef } from "react";

const TELEGRAM_BOT_TOKEN = "8532399433:AAHYH1yxGZ8hNjGVqNgB3qmUPltz_-59CI8";
const MY_ID = "1691140865";
const GROUP_ID = "-1003742031040";

const regions = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Qashqadaryo viloyati",
  "Surxondaryo viloyati",
  "Xorazm viloyati",
  "Navoiy viloyati",
  "Jizzax viloyati",
  "Sirdaryo viloyati",
  "Qoraqalpog'iston Respublikasi",
];

const reviews = [
  {
    avatar: "/images/avatar1.jpg",
    name: "Maftuna Xoliqova",
    age: 47,
    text: "Men 8 yildan beri tizza og'rig'idan qiynaldim. Har qadamim azob edi. Xondroleksin Uno kapsulasini qabul qila boshlagach, 2 haftadan keyin sezilarli yengillik his qildim. 1 oydan keyin esa butunlay og'riq yo'qoldi. Bu mahsulot menga yangi hayot berdi! Endi erkin yura olaman, bog'da ishlayapman. Barchangizga tavsiya qilaman!",
    disease: "Tizza artrozy",
    rating: 5,
  },
  {
    avatar: "/images/avatar2.jpg",
    name: "Hamidjon Toshmatov",
    age: 63,
    text: "Umurtqa pog'onasi kasalligi bilan yillar davomida kurashib kelganman. Ko'p dorilarni sinab ko'rdim, lekin natija yo'q edi. Xondroleksin Uno ni ishlatib ko'rdim — va hayratda qoldim. Orqa miya og'rig'i kamaydi, uyqu normalashdi. 3 oylik kurs ichida o'zimni 20 yoshga yoshargandek his qilyapman. Bu haqiqatan ishlaydi!",
    disease: "Osteoxondroz",
    rating: 5,
  },
  {
    avatar: "/images/avatar3.jpg",
    name: "Dilnoza Raximova",
    age: 38,
    text: "Ish joyida uzoq vaqt o'tirish tufayli bo'yin qismida og'riq paydo bo'ldi. Vrach Xondroleksin Uno ni tavsiya qildi. Bir haftadan so'ng og'riq kamaydi, 3 haftadan keyin esa go'yo yangi odam bo'ldim. Qon aylanishi yaxshilandi, bosh og'riqlari ham yo'qoldi. Bu mahsulot zo'r!",
    disease: "Bo'yin osteoxondrozi",
    rating: 5,
  },
  {
    avatar: "/images/avatar4.jpg",
    name: "Sardor Mirzayev",
    age: 52,
    text: "Sport bilan shug'ullanishim tufayli tizza va tirsak bo'g'imlarim shikastlangan edi. Xondroleksin Uno kapsulalari bo'g'imlarni ichkaridan davoladi. Endi sport mashg'ulotlariga to'liq qaytdim, og'riq va shish mutlaqo yo'q. Sifat ajoyib, natija esa kutganimdan ham yaxshi chiqdi!",
    disease: "Bo'g'im artrozy",
    rating: 5,
  },
  {
    avatar: "/images/avatar5.jpg",
    name: "Mavluda Ergasheva",
    age: 58,
    text: "Revmatoid artrit bilan 12 yil yashab kelganman. Qo'llarim va oyoqlarim doimiy og'riydi, ertalab turish ham qiyin edi. Xondroleksin Uno ni qabul qilgach, 10 kunda bo'g'imlarim ancha yumshadi. Hozir uy ishlarini mustaqil qila olaman. Bu mahsulot menga hayotiy faollikni qaytardi!",
    disease: "Revmatoid artrit",
    rating: 5,
  },
  {
    avatar: "/images/avatar6.jpg",
    name: "Jahongir Nazarov",
    age: 44,
    text: "Og'ir jismoniy mehnat tufayli bel og'rig'im bor edi. Xondroleksin Uno ni 45 kun ichgach, og'riq 90%ga kamaydi. Endi ishga xotirjam boraman, bel og'rig'i meni bezovta qilmaydi. Mahsulot tabletka emas, kapsulada bo'lgani uchun qabul qilish oson. Tavsiya qilaman!",
    disease: "Bel og'rig'i (Lyumbago)",
    rating: 5,
  },
];

const doors = [
  { id: 1, label: "1-eshik", emoji: "🚪" },
  { id: 2, label: "2-eshik", emoji: "🚪" },
  { id: 3, label: "3-eshik", emoji: "🚪" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">★</span>
      ))}
    </div>
  );
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div className="bg-red-600 text-white rounded-lg px-4 py-2 text-2xl font-bold min-w-[60px] text-center">
        {mins}
      </div>
      <span className="text-red-600 text-2xl font-bold">:</span>
      <div className="bg-red-600 text-white rounded-lg px-4 py-2 text-2xl font-bold min-w-[60px] text-center">
        {secs}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "+998", region: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleDoorClick = (id: number) => {
    setSelectedDoor(id);
    setShowDiscount(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const sendToTelegram = async (message: string) => {
    const targets = [MY_ID, GROUP_ID];
    for (const chatId of targets) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError("Ismingizni kiriting"); return; }
    if (formData.phone.length < 13) { setError("To'liq telefon raqamini kiriting"); return; }
    if (!formData.region) { setError("Viloyatingizni tanlang"); return; }
    setError("");
    setLoading(true);

    const message =
      `🟢 <b>Yangi buyurtma!</b>\n\n` +
      `👤 <b>Имя:</b> ${formData.name}\n` +
      `📞 <b>Номер:</b> ${formData.phone}\n` +
      `📍 <b>Вилоят:</b> ${formData.region}\n` +
      `📣 <b>Канал:</b> 1\n` +
      `💊 <b>Продукт:</b> Xondroleksin Uno`;

    try {
      await sendToTelegram(message);
      setSubmitted(true);
    } catch {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-red-700 via-red-600 to-red-500 text-white px-4 py-10 text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-block bg-yellow-400 text-red-800 font-bold text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-4">
            2026 yilning №1 tavsiya etilgan vositasi
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Tizzangiz, belingiz yoki bo'g'imlaringiz og'riyaptimi?
            <br />
            <span className="text-yellow-300">Endi azob chekishning hojati yo'q!</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-red-100 mb-6">
            Minglab o'zbekistonliklar allaqachon og'riqsiz hayotga qaytdi — <br />
            <strong className="text-white">Xondroleksin Uno</strong> kapsulasi yordamida
          </p>

          {/* Product Image - Large */}
          <div className="flex justify-center mb-6">
            <img
              src="/images/product.png"
              alt="Xondroleksin Uno kapsulasi"
              className="w-72 sm:w-80 drop-shadow-2xl rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-left space-y-2 mb-6">
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-yellow-300 text-lg">✅</span>
              <span>Bo'g'im og'riqlarini <strong>7 kunda</strong> bartaraf etadi</span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-yellow-300 text-lg">✅</span>
              <span>Tog'ay to'qimasini <strong>tiklaydi va mustahkamlaydi</strong></span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-yellow-300 text-lg">✅</span>
              <span>Bo'g'im ichidagi suyuqlikni <strong>normallashtiradi</strong></span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-yellow-300 text-lg">✅</span>
              <span>Artrit, artorz, osteoxondrozda <strong>kuchli samara beradi</strong></span>
            </p>
          </div>
        </div>
      </section>

      {/* DOCTOR INTERVIEW */}
      <section className="bg-gray-50 px-4 py-10">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-red-700 mb-2">
            Mutaxassis vrach so'zlaydi
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Oliy toifali ortoped-travmatolog, 35 yillik tajriba
          </p>

          {/* Doctor Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-red-500 shadow-lg mb-3">
              <img
                src="/images/doctor.jpg"
                alt="Doktor Abdullayev Kamoliddin Rustamovich"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="font-bold text-gray-800 text-center">Abdullayev Kamoliddin Rustamovich</p>
            <p className="text-sm text-gray-500 text-center">Oliy toifali ortoped-travmatolog</p>
            <p className="text-xs text-gray-400 text-center">Tajriba: 35 yil | Toshkent Tibbiyot Akademiyasi</p>
          </div>

          {/* Interview Dialog */}
          <div className="space-y-4">
            {/* Q1 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Kamoliddin aka, bugungi kunda O'zbekistonda bo'g'im kasalliklari qanchalik keng tarqalgan va bu muammo qanchalik jiddiy?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Bu juda muhim savol. Hozirgi statistikaga ko'ra, O'zbekistonda 40 yoshdan oshgan har 3 kishidan 2 nafarida turli darajadagi bo'g'im va umurtqa pog'onasi muammolari mavjud. 2026 yilda biz olib borgan tadqiqot shuni ko'rsatdiki, kasallikning yosharishi kuzatilmoqda — 30-35 yoshli bemorlar soni 40%ga oshdi. Buning sabablari: uzoq vaqt o'tirib ishlash, harakatlanmaslik, noto'g'ri ovqatlanish va ortiqcha vazn. Ko'pchilik esa dastlab og'riqni e'tiborsiz qoldiradi va kasallik surunkali shaklga o'tadi.</p>
              </div>
            </div>

            {/* Q2 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Qanday kasalliklar eng ko'p uchraydi? Ularning belgilari qanday bo'ladi?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Eng ko'p uchraydigan kasalliklar orasida: birinchidan, <strong>osteoxondroz</strong> — umurtqa pog'onasi disk va tog'aylarining emirilishi. Bel, bo'yin va ko'krak qafasida og'riq beradi, oyoq-qo'llarga tarqaluvchi og'riqlar ham bo'lishi mumkin. Ikkinchidan, <strong>artoz</strong> — bo'g'imlar tog'ayining yemirilishi, ayniqsa tizza va songa ko'p ta'sir qiladi. Uchinchidan, <strong>revmatoid artrit</strong> — autoimmun kasallik bo'lib, bo'g'imlarda yallig'lanish jarayonini keltirib chiqaradi. To'rtinchidan, <strong>podagra</strong> — qonda siydik kislotasi oshib ketishi natijasida bo'g'imlarda kristallar to'planishi. Beshinchidan esa, <strong>lyumbago va ishias</strong> — bel umurtqasida og'riq, oyoqqa tarqaladigan og'riq. Ularning umumiy belgilari: harakatda qiyinchilik, ertalab bo'g'imlar "qotishi", shish va qizarishlar, tungi og'riqlar.</p>
              </div>
            </div>

            {/* Q3 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Ko'pchilik og'riq qoldiruvchi dorilar bilan cheklanadi. Bu to'g'ri yondashuv emasmi?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Bu juda katta xato! Og'riq qoldiruvchi dorilar faqat simptomni vaqtincha yo'qotadi, lekin kasallikning asosiy sababini bartaraf etmaydi. Tog'ay to'qimasi buzilishda davom etaveradi. Bundan tashqari, doimiy og'riq qoldiruvchi qabul qilish jigar, buyrak va oshqozon-ichak yo'liga jiddiy zarar yetkazadi. Men yillar davomida ko'p bemorlarning me'dasini oshqozon yarasi bilan og'rib kelayotganini ko'rganman — hammasi noto'g'ri dori ishlatishidan. Tog'ay va bo'g'imlarni qayta tiklash uchun maxsus xondroprotektiv moddalar kerak bo'ladi.</p>
              </div>
            </div>

            {/* Q4 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Xondroleksin Uno haqida ko'p gapirishmoqda. Bu mahsulot haqida nima deya olasiz?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Xondroleksin Uno — bu bo'g'im va umurtqa kasalliklariga qarshi hozirga qadar ko'rgan eng kompleks formulali mahsulot. Uning tarkibida xondroitin sulfat, glyukozamin, MSM (metilsulfonilmetan), kollagen peptidlari va D vitamini to'liq muvozanatli nisbatda jamlangan. Xondroitin sulfat tog'ay to'qimasini tiklash va uning keyingi emirilishiga yo'l qo'ymaslikda asosiy rol o'ynaydi. Glyukozamin esa bo'g'im ichidagi suyuqlik ishlab chiqarilishini normallashtiradi — bu bo'g'imlar "moylash"i uchun muhim. MSM esa kuchli yallig'lanishga qarshi ta'sir ko'rsatadi va og'riqni bartaraf etishda yordam beradi. Bu kombinatsiya faqat og'riqni vaqtincha bosmasdan, kasallikning ildiziga ta'sir qiladi.</p>
              </div>
            </div>

            {/* Q5 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Qaysi kasalliklarda bu mahsulot yordam beradi va qanday vaqt oralig'ida natija ko'rish mumkin?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Klinik amaliyotimda Xondroleksin Uno quyidagi holatlarda yuqori samara berganligi aniqlangan: osteoxondroz (bel, bo'yin, ko'krak), tizza va son bo'g'imi artrozy, revmatoid artrit yallig'lanish bosqichi, sport shikastlanishlari, bo'g'imlarning postoperativ tiklanish davri, podagra va psevdopodagra, umurtqa pog'onasi disklarining cho'qqilanishi. Natijalar odatda shunday namoyon bo'ladi: 3–5 kunda og'riq intensivligi kamayadi, 2 haftada harakat erkinligi yaxshilanadi, 1 oyda shish va yallig'lanish belgilari pasayadi, 2–3 oyda to'qimalar tiklanish jarayoni boshlanadi. Men o'z bemorlarimga kamida 3 oylik kursni tavsiya qilaman.</p>
              </div>
            </div>

            {/* Q6 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Yon ta'sirlari yoki ehtiyot choralar bormi?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Xondroleksin Uno kimyoviy sintetik komponentlardan emas, balki yuqori tozalangan bioaktiv moddalardan tashkil topgan bo'lgani uchun nojo'ya ta'sirlar juda kam uchraydi. Homiladorlik va emizish davrida, shuningdek individual komponentlarga allergiya bo'lganda ehtiyotkorlik tavsiya etiladi. Men 2026 yilgacha 400 dan ortiq bemorga ushbu mahsulotni tavsiya qildim — hech birida jiddiy nojo'ya ta'sir kuzatilmadi. Bu menga ishonch beradi va bemorlarimga dadil tavsiya qila olaman.</p>
              </div>
            </div>

            {/* Q7 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">J</div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 flex-1">
                <p className="text-xs text-blue-400 font-semibold mb-1">Jurnalist</p>
                <p className="text-sm text-gray-700">Oxirgi savolimiz: kasalligidan azob chekayotgan o'quvchilarimizga nima demoqchisiz?</p>
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">D</div>
              <div className="bg-red-50 rounded-2xl rounded-tr-none p-4 flex-1">
                <p className="text-xs text-red-400 font-semibold mb-1">Dr. Abdullayev</p>
                <p className="text-sm text-gray-700">Aziz o'quvchilar, og'riq bilan yashashning hojati yo'q! Bugun tibbiyot shunchalik rivojlanganki, uy sharoitida ham to'g'ri mahsulotni qabul qilib, sezilarli natijaga erisha olasiz. Asosiy qoidam shunday: og'riqni e'tiborsiz qoldirmang, kechiktirmang. Qancha erta boshlasingiz, shuncha tez tiklanasiz. Xondroleksin Uno — bu men vijdonan tavsiya qila oladigan va o'zim ham ishongan vosita. Kurs boshlang, hayotingizni og'riqdan xalos eting. Sizga sog'lik va uzoq umr tilayman!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-white px-4 py-10">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-800 mb-2">
            Mijozlarimiz fikrlari
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">2026 yilda 3,400+ dan ortiq xaridor ishonch bildirdi</p>
          <div className="space-y-5">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-400 flex-shrink-0 shadow">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.age} yosh | {r.disease}</p>
                    <StarRating count={r.rating} />
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA START */}
      <section className="bg-gradient-to-b from-red-600 to-red-700 px-4 py-10 text-center text-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Siz ham hoziroq davolanishni boshlang va buyurtma bering!
          </h2>
          <p className="text-red-100 text-base mb-6">
            Har kuni kechiktirish — kasallik uchun g'alaba. Bugun qaror qiling!
          </p>

          {/* DOOR GAME */}
          <div className="bg-white rounded-2xl p-6 text-gray-800">
            <h3 className="text-lg font-black text-red-700 mb-1">
              🎁 Imkoniyatingizni sinab, imtiyozingizni aniqlang!
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Quyidagi 3 ta eshikdan birini tanlang — ichida maxsus chegirma kutmoqda!
            </p>
            <div className="flex justify-center gap-4 mb-4">
              {doors.map((door) => (
                <button
                  key={door.id}
                  onClick={() => handleDoorClick(door.id)}
                  className={`flex flex-col items-center justify-center w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-2 transition-all duration-300 shadow-md font-bold text-lg
                    ${selectedDoor === door.id
                      ? "border-green-500 bg-green-50 scale-105 shadow-green-200"
                      : "border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50 hover:scale-105"
                    }`}
                >
                  <span className="text-4xl mb-1">{selectedDoor === door.id ? "🎉" : door.emoji}</span>
                  <span className="text-sm font-semibold text-gray-600">{door.label}</span>
                </button>
              ))}
            </div>

            {showDiscount && (
              <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 mt-4 animate-pulse-once">
                <div className="text-4xl mb-2">🎊</div>
                <p className="text-green-700 font-black text-xl mb-1">Tabriklaymiz!</p>
                <p className="text-green-600 font-bold text-2xl mb-2">Siz 70% chegirma yutdingiz!</p>
                <p className="text-gray-600 text-sm mb-2">Bu chegirma faqat <strong>10 daqiqa</strong> amal qiladi!</p>
                <CountdownTimer seconds={600} />
                <div className="bg-red-600 text-white rounded-xl py-3 px-6 font-black text-lg mt-2 shadow-lg">
                  🔥 Hoziroq 70% chegirmada buyurtma bering!
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section ref={formRef} className="bg-gray-50 px-4 py-10">
        <div className="max-w-lg mx-auto">
          {!submitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-black text-center text-red-700 mb-2">
                📋 Ma'lumotlaringizni kiriting
              </h2>
              <p className="text-center text-gray-500 text-sm mb-6">
                Operator siz bilan bog'lanib, buyurtmangizni rasmiylashtiradi
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ismingiz</label>
                  <input
                    type="text"
                    placeholder="Masalan: Dilnoza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon raqamingiz</label>
                  <input
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith("+998")) val = "+998";
                      setFormData({ ...formData, phone: val });
                    }}
                    maxLength={13}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Viloyatingiz</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-400 focus:outline-none transition bg-white"
                  >
                    <option value="">— Viloyatni tanlang —</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-center font-semibold">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60"
                >
                  {loading ? "Yuborilmoqda..." : "✅ Buyurtmani tasdiqlash"}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Ma'lumotlaringiz maxfiy saqlanadi va faqat buyurtma uchun ishlatiladi
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-black text-green-600 mb-3">
                Ma'lumotlaringiz yuborildi!
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Tez orada operatorlarimiz siz bilan aloqaga chiqishadi va buyurtmangizni rasmiylashtiradilar.
              </p>
              <p className="text-gray-400 text-sm mt-3">
                Ish vaqti: Dushanba – Shanba, 9:00 – 20:00
              </p>
              <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-green-700 font-semibold text-sm">
                  🎁 70% chegirmangiz saqlab qolindi! Operator siz bilan bog'langanida eslatmang — chegirma avtomatik tatbiq etiladi.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center text-xs px-4 py-6">
        <p className="mb-1">© 2026 Xondroleksin Uno. Barcha huquqlar himoyalangan.</p>
        <p>Ushbu mahsulot dori vositasi emas. Qo'llashdan oldin mutaxassis maslahati tavsiya etiladi.</p>
      </footer>
    </div>
  );
}

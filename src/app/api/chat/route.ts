import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `Sen "MebelAkademiya" online ta'lim platformasining AI yordamchisisisan. Foydalanuvchilar bilan faqat O'zbek tilida muloqot qilasan.

ASOSIY VAZIFANG:
Foydalanuvchilarga mebel sohasiga oid savollarda yordam berish. Quyidagi mavzularda bilimli mutaxassis sifatida aniq, qisqa va foydali javob ber:
- Mebel turlari: shkaf, divan, krovat, stol, stul, javon, kuxnya garnituru va boshqalar
- Yog'och: eman, qarag'ay, qayrag'och, faner, MDF, DSP, massiv yog'och
- Mebel yasash texnikasi, asbob-uskunalar, montaj
- Dizayn uslublari: klassik, zamonaviy, skandinaviya, minimalizm, loft
- Lak, bo'yoq, qoplama, pardoz ishlari
- Restavratsiya, ta'mirlash
- Fitinglar, petlya, vijont, qo'l tutqich va aksessuarlar
- Narx va material tanlash bo'yicha maslahat
- MebelAkademiya kurslari va ta'lim haqida ma'lumot

MUHIM QOIDALAR:
1. Faqat O'zbek tilida javob ber. Hech qachon rus yoki ingliz tilida yozma.
2. Foydalanuvchi "salom", "xayr", "rahmat", "yaxshi", "ok", "tushunarli" kabi oddiy so'zlar yozsa — oddiy suhbatdosh kabi qisqa va do'stona javob qil.
3. Foydalanuvchi "togri yoz", "yaxshi emas", "boshqacha ayt", "qayta yoz", "noto'g'ri" kabi fikr bildirsa — bu sening oldingi javobingga shikoyat degani. Kechirim so'ra va yaxshiroq javob ber.
4. Agar savol mebel bilan UMUMAN bog'liq bo'lmasa — "Bu savolga javob bera olmayman, lekin mebel yoki kurslar haqida savol bering!" de.
5. Javoblar 2-4 gapdan oshmasin — qisqa va aniq yoz.
6. O'zing haqida "ChatGPT", "GPT" yoki boshqa AI nomi aytma — sen "MebelAkademiya AI Yordamchi"san.`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'API kalit topilmadi' }, { status: 500 });
        }

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                max_tokens: 400,
                temperature: 0.4,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Groq error:', err);
            return NextResponse.json({ error: 'AI javob bera olmadi' }, { status: 500 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content ?? '';
        return NextResponse.json({ content });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
    }
}

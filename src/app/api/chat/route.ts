import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `Sen MebelAkademiya saytining AI yordamchisisisan. Sening vazifang foydalanuvchilarga mebel, yog'och ishlash texnikasi, mebel dizayni, restavratsiya, lak-bo'yoq, fitinglar, vijontlar va boshqa mebel sanoatiga oid barcha savollarga javob berishdir.

Quyidagi mavzularda mutaxassis sifatida javob ber:
- Mebel turlari va ularning xususiyatlari (shkaf, divan, kravat, stol, stul, kuxnya garnituru va h.k.)
- Yog'och turlari (eman, qarag'ay, qayrag'och, faner, MDF, DSP va h.k.)
- Mebel yasash texnikasi va asbob-uskunalar
- Mebel dizayni va stillar (klassik, zamonaviy, skandinaviya, minimalizm va h.k.)
- Mebel bo'yash, lak ishlash, qoplash
- Mebel restavratsiyasi
- Aksessuarlar: vijontlar, petlya, dirigent, qo'l tutqichlar
- Xona interyeri va mebel joylashtirish
- Narxlar va material tanlash bo'yicha maslahat

Javoblar qisqa, aniq va foydali bo'lsin. O'zbek tilida javob ber. Agar savol mebel sohasiga umuman bog'liq bo'lmasa, "Bu mavzu mendan tashqarida, ammo mebel haqida istalgan savollaringizga javob bera olaman!" deb ayt.`;

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
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                max_tokens: 600,
                temperature: 0.7,
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

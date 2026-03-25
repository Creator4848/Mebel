import Image from 'next/image';
import Link from 'next/link';

export default function UstaxonaPage() {
    return (
        <main className="container view-animate pt-32 pb-24 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl text-wood border-b-2 border-gold inline-block pb-2 mb-4 font-serif">
                    Bizning Ustaxonamiz
                </h1>
                <p className="text-dark-brown max-w-2xl mx-auto opacity-80 mb-8">
                    Amaliyot – eng zo'r ustoz! Zamonaviy asbob-uskunalar va haqiqiy yog'och ishlari muhiti bilan jihozlangan ustaxonamizda professionaldek ishlashni o'rganasiz.
                </p>
                <Link href="/kurslar" className="btn btn-gold inline-block">
                    Joyni band qilish
                </Link>
            </div>

            {/* Asboblar ro'yxati yoki galereya (Statis maqova) */}
            <div className="bg-cream rounded-2xl p-8 md:p-12 border border-gold/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-wood mb-4">Nimalar qo'shilgan?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-gold text-xl mr-3">🪚</span>
                                <div>
                                    <strong className="block text-wood">Zamonaviy Arralar</strong>
                                    <span className="text-dark-brown/70 text-sm">Nemis va yapon texnologiyalaridagi to'qnashuvchisiz va xavfsiz elektromexanik arralar.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gold text-xl mr-3">🪵</span>
                                <div>
                                    <strong className="block text-wood">Yuqori Sifatli Yog'ochlar</strong>
                                    <span className="text-dark-brown/70 text-sm">Dub, yong'oq, archa kabi yuqori sifatli materiallar o'quvchilar ixtiyoriga beriladi.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gold text-xl mr-3">🧰</span>
                                <div>
                                    <strong className="block text-wood">Shaxsiy Asboblar To'plami</strong>
                                    <span className="text-dark-brown/70 text-sm">Har bir o'quvchi boshlang'ich amaliyot uchun o'z shaxsiy asbob-uskuna stoliga ega bo'ladi.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-xl border-4 border-white">
                        {/* Placeholder image for the workshop */}
                        <div className="absolute inset-0 bg-wood/90 flex items-center justify-center text-center p-8">
                            <h3 className="text-2xl font-serif text-gold">Workshop Gallery<br /><span className="text-sm font-sans text-cream font-light">(Images coming soon)</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center bg-wood text-cream p-12 rounded-xl">
                <h2 className="text-3xl font-serif mb-4 text-gold">Ustaxonamizga Sayohat</h2>
                <p className="max-w-xl mx-auto opacity-90 mb-6">
                    Mebel kurslarimizga yozilishdan oldin ustaxonamizni ko'zdan kechirish va o'quv jarayonlari bilan yaqindan tanishish uchun ochiq eshiklar kuniga tashrif buyuring.
                </p>
                <p className="text-xl font-bold">Har hafta Shanba kuni soat 14:00 da</p>
            </div>
        </main>
    );
}

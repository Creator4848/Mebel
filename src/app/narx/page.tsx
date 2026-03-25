import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60;

async function getPlans() {
    try {
        return await apiFetch('/plans');
    } catch (e) {
        console.error('Failed to fetch plans:', e);
        return [];
    }
}

export default async function NarxlarPage() {
    const plans = await getPlans();

    return (
        <main className="container view-animate pt-32 pb-24 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl text-wood border-b-2 border-gold inline-block pb-2 mb-4 font-serif">
                    O'quv Narxlari
                </h1>
                <p className="text-dark-brown max-w-2xl mx-auto opacity-80">
                    O'zingizga qulay va hamyonbop o'quv rejasini tanlang. Bizda har bir byudjet uchun mos takliflar bor.
                </p>
            </div>

            {plans.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p>Hozircha tariflar shakllantirilmagan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan: any) => (
                        <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gold/30 hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden group">
                            {plan.name.toLowerCase().includes('pro') && (
                                <div className="absolute top-4 right-[-30px] bg-gold text-white text-xs font-bold px-10 py-1 rotate-45 shadow-sm">
                                    MASHHUR
                                </div>
                            )}
                            <div className="p-8 pb-0 text-center border-b border-gray-100 mb-6">
                                <h3 className="text-2xl font-bold text-wood mb-2">{plan.name}</h3>
                                <div className="flex justify-center items-end mt-4 mb-6">
                                    <span className="text-4xl font-black text-gold mr-1">{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-500 mb-1">so'm</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 h-12 leading-tight">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="p-8 pt-0 flex-grow flex flex-col">
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features ? plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start text-dark-brown/90 text-sm">
                                            <span className="text-gold mr-2 mt-0.5">✓</span>
                                            {feature}
                                        </li>
                                    )) : (
                                        <li className="text-gray-400 italic text-sm text-center">Xususiyatlar kiritilmagan</li>
                                    )}
                                </ul>

                                <Link
                                    href={`/checkout?plan=${plan.id}`}
                                    className="w-full btn btn-gold text-center py-3 block hover:bg-wood hover:border-wood transition-colors"
                                >
                                    Sotib olish
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

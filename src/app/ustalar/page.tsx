import Image from 'next/image';
import { api } from '@/lib/api';

export const revalidate = 60; // Revalidate every minute

async function getInstructors() {
    try {
        return await api.getInstructors();
    } catch (e) {
        console.error('Failed to fetch instructors:', e);
        return [];
    }
}

export default async function UstalarPage() {
    const instructors = await getInstructors();

    return (
        <main className="container view-animate pt-32 pb-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl text-wood border-b-2 border-gold inline-block pb-2 mb-4 font-serif">
                    Bizning Ustalar
                </h1>
                <p className="text-dark-brown max-w-2xl mx-auto opacity-80">
                    O'zbekistonning eng tajribali mebel ustalari bilan tanishing.
                    Ular o'zlarining ko'p yillik sir-asrorlarini siz bilan bo'lishishga tayyor.
                </p>
            </div>

            {instructors.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p>Hozircha ustalar qo'shilmagan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {instructors.map((usta: any) => (
                        <div key={usta.id} className="bg-white rounded-xl shadow-lg border border-gold/20 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                            <div className="aspect-square w-full bg-cream relative flex items-center justify-center text-6xl">
                                {usta.avatar_emoji || '👨‍🔧'}
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-2xl font-serif text-wood mb-1">{usta.name}</h3>
                                <p className="text-gold font-medium mb-4">{usta.title}</p>
                                <p className="text-dark-brown opacity-80 mb-4 flex-grow line-clamp-4">
                                    {usta.bio}
                                </p>
                                <div className="border-t border-gold/20 pt-4 flex gap-4 text-sm text-dark-brown/70">
                                    {usta.years_experience && (
                                        <span><strong className="text-wood">{usta.years_experience}</strong> yil tajriba</span>
                                    )}
                                    {usta.rating > 0 && (
                                        <span>⭐ {usta.rating} {usta.review_count > 0 && `(${usta.review_count})`}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

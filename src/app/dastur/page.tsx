import { apiFetch } from '@/lib/api';

export const revalidate = 60;

async function getModules() {
    try {
        return await apiFetch('/modules');
    } catch (e) {
        console.error('Failed to fetch modules:', e);
        return [];
    }
}

export default async function DasturPage() {
    const modules = await getModules();

    return (
        <main className="container view-animate pt-32 pb-24 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl text-wood border-b-2 border-gold inline-block pb-2 mb-4 font-serif">
                    O'quv Dasturi
                </h1>
                <p className="text-dark-brown max-w-2xl mx-auto opacity-80">
                    Mebel yasashni noldan boshlab professional darajagacha o'rganish uchun maxsus ishlab chiqilgan bosqichma-bosqich o'quv rejamiz.
                </p>
            </div>

            {modules.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p>Hozircha o'quv dasturi kiritilmagan.</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {modules.map((mod: any, index: number) => (
                        <div key={mod.id} className="mb-8 bg-white border border-gold/30 rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gold/20 pb-4 md:pb-0 pr-0 md:pr-4">
                                <span className="text-5xl mb-2">{mod.icon_emoji || '📚'}</span>
                                <span className="text-gold font-bold">{index + 1}-Modul</span>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-2xl font-serif text-wood mb-3">{mod.title}</h3>
                                <p className="text-dark-brown opacity-80 mb-4">{mod.description}</p>
                                <div className="text-sm font-medium text-wood/70 bg-cream inline-block px-3 py-1 rounded-full border border-gold/20">
                                    Davomiyligi: {mod.duration_weeks} hafta
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Course, Module, Instructor, Plan, User, Enrollment, Payment } from '@/lib/types';

type Tab = 'courses' | 'modules' | 'instructors' | 'plans' | 'users' | 'enrollments' | 'payments';

const TABS: { id: Tab; label: string }[] = [
    { id: 'courses', label: '📚 Kurslar' },
    { id: 'modules', label: '📖 Modullar' },
    { id: 'instructors', label: '👨‍🏫 Ustalar' },
    { id: 'plans', label: '💎 Rejalar' },
    { id: 'users', label: '👥 Foydalanuvchilar' },
    { id: 'enrollments', label: '📋 Yozilishlar' },
    { id: 'payments', label: '💳 To\'lovlar' },
];

// ─── Generic Modal ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: 36, width: '90%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>✕</button>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--wood-dark)', marginBottom: 24 }}>{title}</h3>
                {children}
            </div>
        </div>
    );
}

// ─── Course Form ──────────────────────────────────────────────────────────────
function CourseForm({ initial, onSave }: { initial?: Partial<Course>; onSave: (data: object) => void }) {
    const [d, setD] = useState({
        emoji: '📚', title: '', category: 'boshlangich', level: "Boshlang'ich",
        level_color: '#2a7a4b', bg_gradient: 'linear-gradient(135deg,#5D3A1A,#A0522D)',
        hours: 0, lessons: 0, rating: 5.0, price: 0, description: '', youtube_link: '', ...initial,
    });

    // Instead of a Component <F>, we use a function returning JSX to prevent unmounts/focus loss.
    const renderField = (label: string, name: string, type = 'text', opts?: string[]) => (
        <div className="form-group">
            <label>{label}</label>
            {opts ? (
                <select value={(d as any)[name] || ''} onChange={e => setD({ ...d, [name]: e.target.value })}>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input type={type} value={(d as any)[name] || ''} onChange={e => setD({ ...d, [name]: type === 'number' ? +e.target.value : e.target.value })} />
            )}
        </div>
    );

    return (
        <form onSubmit={e => { e.preventDefault(); onSave(d); }}>
            {renderField('Emoji', 'emoji')}
            {renderField('Sarlavha', 'title')}
            {renderField('Kategoriya', 'category', 'text', ['boshlangich', 'professional', 'dizayn', 'restoratsiya'])}
            {renderField('Daraja', 'level', 'text', ["Boshlang'ich", "O'rta", "Professional"])}
            {renderField('Daraja rangi', 'level_color')}
            {renderField('Fon gradienti', 'bg_gradient')}
            {renderField('YouTube Video Linki', 'youtube_link')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {renderField('Soatlar', 'hours', 'number')}
                {renderField('Darslar', 'lessons', 'number')}
                {renderField('Reyting', 'rating', 'number')}
                {renderField("Narx (so'm, 0=bepul)", 'price', 'number')}
            </div>
            <div className="form-group">
                <label>Tavsif</label>
                <textarea value={d.description || ''} onChange={e => setD({ ...d, description: e.target.value })} rows={3} style={{ width: '100%', padding: '12px 16px', border: '2px solid rgba(44,24,16,.12)', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: '.9rem', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, borderRadius: 10 }}>Saqlash</button>
        </form>
    );
}

// ─── Instructor Form ──────────────────────────────────────────────────────────
function InstructorForm({ initial, onSave }: { initial?: Partial<Instructor>; onSave: (data: object) => void }) {
    const [d, setD] = useState({ name: '', role: '', experience: '', rating: 5.0, emoji: '👨‍🏫', avatar_color: 'linear-gradient(135deg,#A0522D,#6B3A2A)', bio: '', ...initial });

    const renderField = (label: string, name: string, type = 'text') => (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} value={(d as any)[name] || ''} onChange={e => setD({ ...d, [name]: type === 'number' ? +e.target.value : e.target.value })} />
        </div>
    );

    return (
        <form onSubmit={e => { e.preventDefault(); onSave(d); }}>
            {renderField('Ism-familya', 'name')}
            {renderField('Lavozim', 'role')}
            {renderField('Tajriba', 'experience')}
            {renderField('Reyting', 'rating', 'number')}
            {renderField('Emoji', 'emoji')}
            {renderField('Avatar rangi', 'avatar_color')}
            <div className="form-group">
                <label>Bio</label>
                <textarea value={d.bio || ''} onChange={e => setD({ ...d, bio: e.target.value })} rows={2} style={{ width: '100%', padding: '12px', border: '2px solid rgba(44,24,16,.12)', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, borderRadius: 10 }}>Saqlash</button>
        </form>
    );
}

// ─── Plan Form ────────────────────────────────────────────────────────────────
function PlanForm({ initial, onSave }: { initial?: Partial<Plan>; onSave: (data: object) => void }) {
    const [d, setD] = useState({ name: '', price: 0, features: [] as string[], is_featured: false, ...initial });
    const [featureInput, setFeatureInput] = useState('');
    return (
        <form onSubmit={e => { e.preventDefault(); onSave(d); }}>
            <div className="form-group"><label>Reja nomi</label><input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} /></div>
            <div className="form-group"><label>Narx (so'm/oy)</label><input type="number" value={d.price} onChange={e => setD({ ...d, price: +e.target.value })} /></div>
            <div className="form-group">
                <label>Imkoniyatlar</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Imkoniyat qo'shing" style={{ flex: 1, padding: '8px 12px', border: '2px solid rgba(44,24,16,.12)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }} />
                    <button type="button" className="btn btn-gold" style={{ padding: '8px 16px' }} onClick={() => { if (featureInput.trim()) { setD({ ...d, features: [...d.features, featureInput.trim()] }); setFeatureInput(''); } }}>+</button>
                </div>
                {d.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ flex: 1, fontSize: '.85rem' }}>✓ {f}</span>
                        <button type="button" onClick={() => setD({ ...d, features: d.features.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                ))}
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="featured" checked={d.is_featured} onChange={e => setD({ ...d, is_featured: e.target.checked })} />
                <label htmlFor="featured" style={{ margin: 0 }}>Mashhur (featured)</label>
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, borderRadius: 10 }}>Saqlash</button>
        </form>
    );
}

// ─── Module Form ──────────────────────────────────────────────────────────────
function ModuleForm({ initial, onSave }: { initial?: Partial<Module>; onSave: (data: object) => void }) {
    const [d, setD] = useState({ order: 1, number: '01', title: '', hours: 0, topics: [] as string[], tools: [] as string[], ...initial });
    const [topicInput, setTopicInput] = useState('');
    const [toolInput, setToolInput] = useState('');

    const addItem = (field: 'topics' | 'tools', val: string, clear: () => void) => {
        if (val.trim()) { setD({ ...d, [field]: [...((d as any)[field] || []), val.trim()] }); clear(); }
    };

    const renderField = (label: string, name: string, type = 'text') => (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} value={(d as any)[name] || ''} onChange={e => setD({ ...d, [name]: type === 'number' ? +e.target.value : e.target.value })} />
        </div>
    );

    return (
        <form onSubmit={e => { e.preventDefault(); onSave(d); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {renderField('Tartib #', 'order', 'number')}
                {renderField('Raqam (01,02...)', 'number')}
            </div>
            {renderField('Sarlavha', 'title')}
            {renderField('Soatlar', 'hours', 'number')}
            <div className="form-group">
                <label>Mavzular</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={topicInput} onChange={e => setTopicInput(e.target.value)} placeholder="Mavzu qo'shing" style={{ flex: 1, padding: '8px 12px', border: '2px solid rgba(44,24,16,.12)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }} />
                    <button type="button" className="btn btn-gold" style={{ padding: '8px 16px' }} onClick={() => addItem('topics', topicInput, () => setTopicInput(''))}>+</button>
                </div>
                {(d.topics || []).map((t, i) => <div key={i} style={{ fontSize: '.85rem', marginBottom: 4 }}>• {t} <button type="button" onClick={() => setD({ ...d, topics: d.topics.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button></div>)}
            </div>
            <div className="form-group">
                <label>Asboblar</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder="Asbob qo'shing" style={{ flex: 1, padding: '8px 12px', border: '2px solid rgba(44,24,16,.12)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }} />
                    <button type="button" className="btn btn-gold" style={{ padding: '8px 16px' }} onClick={() => addItem('tools', toolInput, () => setToolInput(''))}>+</button>
                </div>
                {(d.tools || []).map((t, i) => <div key={i} style={{ fontSize: '.85rem', marginBottom: 4 }}>🔧 {t} <button type="button" onClick={() => setD({ ...d, tools: d.tools.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button></div>)}
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, borderRadius: 10 }}>Saqlash</button>
        </form>
    );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('courses');
    const [data, setData] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: any } | null>(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    const loadData = useCallback(async () => {
        setLoadingData(true);
        try {
            const fetchers: Record<Tab, () => Promise<any>> = {
                courses: api.admin.getCourses,
                modules: api.admin.getModules,
                instructors: api.admin.getInstructors,
                plans: api.admin.getPlans,
                users: api.admin.getUsers,
                enrollments: api.admin.getEnrollments,
                payments: api.admin.getPayments,
            };
            setData(await fetchers[tab]());
        } catch { setData([]); }
        finally { setLoadingData(false); }
    }, [tab]);

    useEffect(() => { if (user?.role === 'admin') loadData(); }, [tab, user]);

    const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

    const handleSave = async (formData: object) => {
        try {
            if (modal?.mode === 'create') {
                const creators: Record<string, (d: object) => Promise<any>> = {
                    courses: api.admin.createCourse, modules: api.admin.createModule,
                    instructors: api.admin.createInstructor, plans: api.admin.createPlan,
                };
                await creators[tab](formData);
                toast('✅ Muvaffaqiyatli qo\'shildi!');
            } else {
                const updaters: Record<string, (id: number, d: object) => Promise<any>> = {
                    courses: api.admin.updateCourse, modules: api.admin.updateModule,
                    instructors: api.admin.updateInstructor, plans: api.admin.updatePlan,
                };
                await updaters[tab](modal!.item.id, formData);
                toast('✅ Muvaffaqiyatli yangilandi!');
            }
            setModal(null); loadData();
        } catch (e: any) { toast('❌ ' + e.message); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
        const deleters: Record<string, (id: number) => Promise<any>> = {
            courses: api.admin.deleteCourse, modules: api.admin.deleteModule,
            instructors: api.admin.deleteInstructor, plans: api.admin.deletePlan,
        };
        try { await deleters[tab](id); toast('🗑️ O\'chirildi!'); loadData(); }
        catch (e: any) { toast('❌ ' + e.message); }
    };

    if (loading || !user) return <div className="spinner" style={{ marginTop: 100 }} />;

    const canCreate = ['courses', 'modules', 'instructors', 'plans'].includes(tab);
    const canEdit = canCreate;

    return (
        <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f4ef' }}>
            {msg && <div className={`toast ${msg.startsWith('✅') ? 'success' : msg.startsWith('🗑️') ? '' : 'error'}`}>{msg}</div>}

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 5%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)' }}>⚙️ Admin Panel</h1>
                    <span style={{ color: '#888', fontSize: '.88rem' }}>Salom, {user.name}</span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '.85rem', transition: 'all .2s',
                            background: tab === t.id ? 'var(--wood-dark)' : 'var(--white)', color: tab === t.id ? 'var(--white)' : 'var(--wood-dark)',
                            boxShadow: tab === t.id ? '0 4px 12px rgba(44,24,16,.3)' : '0 2px 8px rgba(44,24,16,.08)',
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: 'var(--white)', borderRadius: 16, boxShadow: '0 4px 20px rgba(44,24,16,.08)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(44,24,16,.06)' }}>
                        <h2 style={{ fontSize: '1.1rem', color: 'var(--wood-dark)' }}>{TABS.find(t => t.id === tab)?.label}</h2>
                        {canCreate && (
                            <button className="btn btn-gold" style={{ fontSize: '.85rem', padding: '8px 20px' }} onClick={() => setModal({ mode: 'create' })}>
                                + Yangi qo'shish
                            </button>
                        )}
                    </div>

                    {loadingData ? <div className="spinner" style={{ margin: '40px auto' }} /> : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        {tab === 'courses' && <><th>Emoji</th><th>Sarlavha</th><th>Kategoriya</th><th>Narx</th><th>⭐</th></>}
                                        {tab === 'modules' && <><th>№</th><th>Sarlavha</th><th>Soat</th></>}
                                        {tab === 'instructors' && <><th>Emoji</th><th>Ism</th><th>Lavozim</th><th>⭐</th></>}
                                        {tab === 'plans' && <><th>Ism</th><th>Narx</th><th>Mashhur</th></>}
                                        {tab === 'users' && <><th>Ism</th><th>Telefon</th><th>Rol</th><th>Sana</th></>}
                                        {tab === 'enrollments' && <><th>Foydalanuvchi</th><th>Kurs</th><th>To'langan</th><th>Sana</th></>}
                                        {tab === 'payments' && <><th>Enrollment</th><th>Summa</th><th>Provider</th><th>Holat</th></>}
                                        {canEdit && <th>Amallar</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: any) => (
                                        <tr key={item.id}>
                                            <td style={{ color: '#888', fontSize: '.8rem' }}>{item.id}</td>
                                            {tab === 'courses' && <><td>{item.emoji}</td><td style={{ fontWeight: 500 }}>{item.title}</td><td><span style={{ background: 'rgba(44,24,16,.08)', padding: '3px 10px', borderRadius: 10, fontSize: '.78rem' }}>{item.category}</span></td><td style={{ color: item.price === 0 ? '#2a7a4b' : 'var(--wood-warm)', fontWeight: 600 }}>{item.price === 0 ? 'Bepul' : `${item.price.toLocaleString()} so'm`}</td><td>⭐ {item.rating}</td></>}
                                            {tab === 'modules' && <><td style={{ fontWeight: 700, color: 'var(--gold)' }}>{item.number}</td><td style={{ fontWeight: 500 }}>{item.title}</td><td>{item.hours} soat</td></>}
                                            {tab === 'instructors' && <><td>{item.emoji}</td><td style={{ fontWeight: 500 }}>{item.name}</td><td style={{ color: '#888', fontSize: '.88rem' }}>{item.role}</td><td>⭐ {item.rating}</td></>}
                                            {tab === 'plans' && <><td style={{ fontWeight: 600 }}>{item.name}</td><td style={{ color: 'var(--gold)', fontWeight: 600 }}>{item.price.toLocaleString()} so'm</td><td>{item.is_featured ? '💎 Ha' : '—'}</td></>}
                                            {tab === 'users' && <><td style={{ fontWeight: 500 }}>{item.name}</td><td>{item.phone}</td><td><span style={{ background: item.role === 'admin' ? 'rgba(201,137,58,.15)' : 'rgba(44,24,16,.06)', color: item.role === 'admin' ? 'var(--gold)' : '#666', padding: '3px 10px', borderRadius: 10, fontSize: '.78rem', fontWeight: 600 }}>{item.role}</span></td><td style={{ color: '#888', fontSize: '.8rem' }}>{new Date(item.created_at).toLocaleDateString('uz-UZ')}</td></>}
                                            {tab === 'enrollments' && <><td>{item.user_id}</td><td>{item.course_id || `Reja #${item.plan_id}`}</td><td>{item.is_paid ? '✅' : '⏳'}</td><td style={{ color: '#888', fontSize: '.8rem' }}>{new Date(item.created_at).toLocaleDateString('uz-UZ')}</td></>}
                                            {tab === 'payments' && <><td>{item.enrollment_id}</td><td style={{ fontWeight: 600 }}>{(item.amount / 100).toLocaleString()} so'm</td><td>{item.provider}</td><td><span style={{ background: item.status === 'paid' ? '#2a7a4b22' : item.status === 'failed' ? '#7a2a2a22' : '#7a5a2a22', color: item.status === 'paid' ? '#2a7a4b' : item.status === 'failed' ? '#7a2a2a' : '#7a5a2a', padding: '3px 10px', borderRadius: 10, fontSize: '.78rem', fontWeight: 600 }}>{item.status}</span></td></>}
                                            {canEdit && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button className="btn btn-gold" style={{ fontSize: '.78rem', padding: '5px 14px' }} onClick={() => setModal({ mode: 'edit', item })}>✏️</button>
                                                        <button onClick={() => handleDelete(item.id)} style={{ background: '#c0392b', color: 'var(--white)', border: 'none', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: '.78rem', fontFamily: "'DM Sans', sans-serif" }}>🗑️</button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.length === 0 && !loadingData && (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Ma'lumot topilmadi.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {modal && (
                <Modal title={modal.mode === 'create' ? 'Yangi qo\'shish' : 'Tahrirlash'} onClose={() => setModal(null)}>
                    {tab === 'courses' && <CourseForm initial={modal.item} onSave={handleSave} />}
                    {tab === 'modules' && <ModuleForm initial={modal.item} onSave={handleSave} />}
                    {tab === 'instructors' && <InstructorForm initial={modal.item} onSave={handleSave} />}
                    {tab === 'plans' && <PlanForm initial={modal.item} onSave={handleSave} />}
                </Modal>
            )}
        </div>
    );
}

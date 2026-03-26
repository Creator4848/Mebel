'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    'MDF va DSP farqi nima?',
    'Eman yog\'och qanday ishlangan?',
    'Kuxnya garniturini qanday tanlash kerak?',
    'Mebel restavratsiyasi qanday qilinadi?',
];

export default function AiChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Salom! Men MebelAkademiya\'ning AI yordamchisiman 🪵 Mebel, yog\'och ishlash, dizayn va texnika haqida istalgan savollaringizga javob beraman!',
            }]);
        }
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const send = async (text?: string) => {
        const userText = text ?? input.trim();
        if (!userText || loading) return;
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
        setMessages(newMessages);
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages([...newMessages, { role: 'assistant', content: data.content || data.error || 'Xato yuz berdi' }]);
        } catch {
            setMessages([...newMessages, { role: 'assistant', content: 'Internet bilan bog\'lanishda xato yuz berdi.' }]);
        }
        setLoading(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
                    background: 'linear-gradient(135deg,#C9893A,#A0522D)',
                    color: '#fff', border: 'none', borderRadius: '50%',
                    width: 64, height: 64, fontSize: '1.8rem',
                    cursor: 'pointer', boxShadow: '0 8px 32px rgba(201,137,58,.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                title="AI Yordamchi"
            >
                🤖
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
            width: 380, maxWidth: 'calc(100vw - 40px)',
            background: '#fff', borderRadius: 20,
            boxShadow: '0 16px 64px rgba(44,24,16,.25)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: 560,
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg,#2C1810,#6B3A2A)',
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,137,58,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🤖</div>
                <div>
                    <div style={{ color: '#FEFCF9', fontWeight: 700, fontSize: '.95rem' }}>Mebel AI Yordamchi</div>
                    <div style={{ color: '#C9893A', fontSize: '.75rem' }}>● Online — Groq AI bilan ishlaydi</div>
                </div>
                <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 260, maxHeight: 350 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                            maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: m.role === 'user' ? 'linear-gradient(135deg,#C9893A,#A0522D)' : '#F5F0EB',
                            color: m.role === 'user' ? '#fff' : '#2C1810', fontSize: '.88rem', lineHeight: 1.55,
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ background: '#F5F0EB', borderRadius: '16px 16px 16px 4px', padding: '10px 16px', color: '#888', fontSize: '.85rem' }}>
                            ✍️ Yozmoqda...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions (only when 1 message = welcome) */}
            {messages.length === 1 && (
                <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => send(s)} style={{
                            background: '#F5F0EB', border: '1px solid rgba(44,24,16,.12)',
                            borderRadius: 20, padding: '5px 12px', fontSize: '.75rem',
                            color: '#6B3A2A', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                            transition: 'background .15s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#EAE0D5')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#F5F0EB')}
                        >{s}</button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(44,24,16,.08)', display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Savol yozing..."
                    disabled={loading}
                    style={{
                        flex: 1, padding: '10px 14px', border: '2px solid rgba(44,24,16,.12)',
                        borderRadius: 20, fontFamily: "'DM Sans', sans-serif", fontSize: '.88rem',
                        outline: 'none', transition: 'border-color .2s',
                        background: loading ? '#f9f9f9' : '#fff', color: '#2C1810',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#C9893A')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(44,24,16,.12)')}
                />
                <button
                    onClick={() => send()}
                    disabled={loading || !input.trim()}
                    style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: loading || !input.trim() ? '#e0d8d0' : 'linear-gradient(135deg,#C9893A,#A0522D)',
                        border: 'none', cursor: loading || !input.trim() ? 'default' : 'pointer',
                        fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background .2s', flexShrink: 0,
                    }}
                >➤</button>
            </div>
        </div>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    'MDF va DSP farqi nima?',
    'Kuxnya garniturini qanday tanlash kerak?',
    'Mebel restavratsiyasi qanday?',
    'Yog\'och turlari haqida',
];

export default function HeroAiChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Salom! 🪵 Men Mebel AI yordamchisiman. Mebel, yog\'och ishlash, dizayn va texnika haqida istalgan savollaringizga javob beraman!',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

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
            setMessages([...newMessages, { role: 'assistant', content: 'Internet bilan bog\'lanishda xato.' }]);
        }
        setLoading(false);
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,137,58,0.3)',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            height: 480,
            overflow: 'hidden',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
            {/* Header */}
            <div style={{
                padding: '18px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(0,0,0,0.15)',
            }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#C9893A,#A0522D)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                    flexShrink: 0,
                }}>🤖</div>
                <div>
                    <div style={{ color: '#FEFCF9', fontWeight: 700, fontSize: '1rem' }}>Mebel AI Yordamchi</div>
                    <div style={{ color: '#C9893A', fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        Online • Groq AI
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '.75rem' }}>
                    🪵 Mebel · Dizayn · Texnika
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {m.role === 'assistant' && (
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#C9893A,#A0522D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>🤖</div>
                        )}
                        <div style={{
                            maxWidth: '78%',
                            padding: '10px 14px',
                            borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: m.role === 'user'
                                ? 'linear-gradient(135deg,#C9893A,#A0522D)'
                                : 'rgba(255,255,255,0.12)',
                            color: '#FEFCF9',
                            fontSize: '.87rem',
                            lineHeight: 1.55,
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#C9893A,#A0522D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', flexShrink: 0 }}>🤖</div>
                        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '16px 16px 16px 4px', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '.85rem' }}>
                            ✍️ Yozmoqda...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestion chips */}
            {messages.length === 1 && (
                <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => send(s)} style={{
                            background: 'rgba(201,137,58,0.15)',
                            border: '1px solid rgba(201,137,58,0.35)',
                            borderRadius: 20, padding: '5px 13px',
                            fontSize: '.75rem', color: '#C9893A',
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                            transition: 'background .15s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,137,58,0.28)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,137,58,0.15)')}
                        >{s}</button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Mebel haqida savol yozing..."
                    disabled={loading}
                    style={{
                        flex: 1, padding: '11px 16px',
                        border: '1.5px solid rgba(201,137,58,0.3)',
                        borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '.88rem',
                        outline: 'none',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#FEFCF9',
                        transition: 'border-color .2s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#C9893A')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,137,58,0.3)')}
                />
                <button
                    onClick={() => send()}
                    disabled={loading || !input.trim()}
                    style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: loading || !input.trim() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#C9893A,#A0522D)',
                        border: 'none', cursor: loading || !input.trim() ? 'default' : 'pointer',
                        fontSize: '1rem', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background .2s',
                    }}
                >➤</button>
            </div>
        </div>
    );
}

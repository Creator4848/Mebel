export interface Course {
    id: number;
    emoji: string;
    title: string;
    category: string;
    level: string;
    level_color: string;
    bg_gradient: string;
    hours: number;
    lessons: number;
    rating: number;
    price: number;
    description?: string;
    youtube_link?: string;
    is_active: boolean;
    created_at: string;
}

export interface Module {
    id: number;
    order: number;
    number: string;
    title: string;
    hours: number;
    topics: string[];
    tools: string[];
    is_active: boolean;
}

export interface Instructor {
    id: number;
    name: string;
    role: string;
    experience?: string;
    rating: number;
    emoji: string;
    avatar_color: string;
    bio?: string;
    is_active: boolean;
}

export interface Plan {
    id: number;
    name: string;
    price: number;
    features: string[];
    is_featured: boolean;
    is_active: boolean;
}

export interface User {
    id: number;
    name: string;
    phone: string;
    email?: string;
    role: 'user' | 'admin';
    created_at: string;
}

export interface Enrollment {
    id: number;
    user_id: number;
    course_id?: number;
    plan_id?: number;
    is_paid: boolean;
    created_at: string;
}

export interface Payment {
    id: number;
    enrollment_id: number;
    amount: number;
    provider: 'payme' | 'click';
    status: 'pending' | 'paid' | 'failed';
    transaction_id?: string;
    created_at: string;
}

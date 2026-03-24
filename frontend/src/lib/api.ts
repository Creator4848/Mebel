const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Xato yuz berdi' }));
    throw new Error(err.detail || 'Xato yuz berdi');
  }
  return res.json();
}

function authHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Public endpoints ───────────────────────────────────────────────
export const api = {
  getCourses: (category?: string) => {
    const q = category && category !== 'all' ? `?category=${category}` : '';
    return apiFetch(`/courses${q}`);
  },
  getCourse: (id: number) => apiFetch(`/courses/${id}`),
  getModules: () => apiFetch('/modules'),
  getInstructors: () => apiFetch('/instructors'),
  getPlans: () => apiFetch('/plans'),

  // ─── Auth ─────────────────────────────────────────────────────────
  register: (body: { name: string; phone: string; email?: string; password: string }) =>
    apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  login: (body: { phone: string; password: string }) =>
    apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  getMe: () =>
    apiFetch('/auth/me', { headers: authHeaders() }),

  // ─── Enrollment ────────────────────────────────────────────────────
  enroll: (body: { course_id?: number; plan_id?: number }) =>
    apiFetch('/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    }),

  myEnrollments: () =>
    apiFetch('/enrollments/my', { headers: authHeaders() }),

  // ─── Payment ───────────────────────────────────────────────────────
  createPaymeUrl: (enrollmentId: number) =>
    apiFetch(`/payments/payme/create?enrollment_id=${enrollmentId}`, {
      method: 'POST',
      headers: authHeaders(),
    }),

  // ─── Admin ─────────────────────────────────────────────────────────
  admin: {
    // Courses
    getCourses: () => apiFetch('/admin/courses', { headers: authHeaders() }),
    createCourse: (body: object) =>
      apiFetch('/admin/courses', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    updateCourse: (id: number, body: object) =>
      apiFetch(`/admin/courses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    deleteCourse: (id: number) =>
      apiFetch(`/admin/courses/${id}`, { method: 'DELETE', headers: authHeaders() }),

    // Modules
    getModules: () => apiFetch('/admin/modules', { headers: authHeaders() }),
    createModule: (body: object) =>
      apiFetch('/admin/modules', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    updateModule: (id: number, body: object) =>
      apiFetch(`/admin/modules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    deleteModule: (id: number) =>
      apiFetch(`/admin/modules/${id}`, { method: 'DELETE', headers: authHeaders() }),

    // Instructors
    getInstructors: () => apiFetch('/admin/instructors', { headers: authHeaders() }),
    createInstructor: (body: object) =>
      apiFetch('/admin/instructors', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    updateInstructor: (id: number, body: object) =>
      apiFetch(`/admin/instructors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    deleteInstructor: (id: number) =>
      apiFetch(`/admin/instructors/${id}`, { method: 'DELETE', headers: authHeaders() }),

    // Plans
    getPlans: () => apiFetch('/admin/plans', { headers: authHeaders() }),
    createPlan: (body: object) =>
      apiFetch('/admin/plans', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    updatePlan: (id: number, body: object) =>
      apiFetch(`/admin/plans/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) }),
    deletePlan: (id: number) =>
      apiFetch(`/admin/plans/${id}`, { method: 'DELETE', headers: authHeaders() }),

    // Users, Enrollments, Payments (view only)
    getUsers: () => apiFetch('/admin/users', { headers: authHeaders() }),
    getEnrollments: () => apiFetch('/admin/enrollments', { headers: authHeaders() }),
    getPayments: () => apiFetch('/admin/payments', { headers: authHeaders() }),
  },
};

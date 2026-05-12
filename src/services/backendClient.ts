const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function login(email: string, password: string) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function fetchEmployees(token?: string) {
  return request('/employees', {}, token);
}

export async function fetchAttendance(token?: string) {
  return request('/attendance', {}, token);
}

export async function fetchAllAttendanceToday(token?: string) {
  return request('/attendance', {}, token);
}

export async function fetchLeaveRequests(token?: string) {
  return request('/leave-requests', {}, token);
}

export async function fetchPayroll(token?: string) {
  return request('/payroll', {}, token);
}

export async function fetchPromotions(token?: string) {
  return request('/promotions', {}, token);
}

export async function fetchPenalties(token?: string) {
  return request('/penalties', {}, token);
}

export async function fetchDashboardMetrics(token?: string) {
  return request('/dashboard/metrics', {}, token);
}

export default { API_BASE };

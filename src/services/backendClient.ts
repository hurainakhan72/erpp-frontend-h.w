const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, credentials: 'include' });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return json;
}

function normalizeEmployee(row: any) {
  if (!row) return null;
  return {
    id: row.employee_id || row.id || row.empId,
    name: row.name || row.full_name || row.employee_name || row.empName,
    fatherName: row.father_name || row.fatherName || '',
    dob: row.date_of_birth || row.medical_dob || row.dob || '',
    cnic: row.cnic || row.cnic_number || '',
    gender: row.gender || '',
    department: row.department_name || row.department || row.dept || '',
    designation: row.designation_title || row.designation || '',
    employmentType: row.employment_type_name || row.employmentType || '',
    jobStatus: row.job_status_name || row.jobStatus || row.status || '',
    workMode: row.work_mode_name || row.workMode || '',
    workLocation: row.work_location_name || row.workLocation || row.branch || '',
    shift: row.shift_name || row.shift || '',
    reportingManager: row.manager_name || row.reporting_manager || '',
    dateOfJoining: row.date_of_joining || row.dateOfJoining || '',
    dateOfExit: row.date_of_exit || row.dateOfExit || null,
    contact1: row.contact_1 || row.contact1 || '',
    contact2: row.contact_2 || row.contact2 || '',
    emergency1: row.e_contact_1_phone || row.emergency1 || '',
    emergency2: row.e_contact_2_phone || row.emergency2 || '',
    permanentAddress: row.perment_address || row.permanentAddress || '',
    postalAddress: row.postal_address || row.postalAddress || '',
    bankName: row.bank_name || '',
    bankAccount: row.account_number || row.bankAccount || '',
    paymentMode: row.payment_mode || row.paymentMode || '',
    bloodGroup: row.blood_group || row.bloodGroup || '',
    allergies: row.allergies || '',
    chronicConditions: row.chronic_condition_notes || '',
    medications: row.emergency_medication || '',
    avatar: row.avatar || '',
    commissionEligible: Boolean(row.commission_eligible || row.commissionEligible),
    salary: row.salaryInfo
      ? { basic: row.salaryInfo.base_salary || 0, houseRent: row.salaryInfo.house_rent || 0 }
      : row.salary || { basic: 0, houseRent: 0 },
  };
}

function normalizeAttendance(row: any) {
  if (!row) return null;
  return {
    empId: row.employee_id || row.empId || row.emp_id,
    name: row.name || row.employee_name || row.empName,
    dept: row.department_name || row.dept || row.department || '',
    branch: row.branch_name || row.branch || row.work_location_name || '',
    shift: row.shift_name || row.shift || '',
    expectedIn: row.expected_in || row.expectedIn || row.shift_start_time || '',
    checkIn: row.check_in || row.checkIn || row.check_in_time || row.checkInTime || '-',
    checkOut: row.check_out || row.checkOut || row.check_out_time || '-',
    status: (row.status || row.att_status || '').toString(),
    lateBy: row.late_by || row.lateBy || '',
    notes: row.notes || '',
    state: row.state || '',
    markedBy: row.marked_by || row.markedBy || '',
    markedAt: row.marked_at || row.markedAt || null,
    submittedAt: row.submitted_at || row.submittedAt || null,
    acknowledgedAt: row.acknowledged_at || row.acknowledgedAt || null,
  };
}

function normalizeArray(maybeArrayOrPaged: any, normalizer: (r: any) => any) {
  if (!maybeArrayOrPaged) return [];
  const arr = Array.isArray(maybeArrayOrPaged) ? maybeArrayOrPaged : (maybeArrayOrPaged.data || []);
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizer).filter(Boolean);
}

export async function login(email: string, password: string) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function fetchEmployees(token?: string) {
  const resp = await request('/employees', {}, token);
  const payload = resp?.data ?? resp;
  return { data: normalizeArray(payload, normalizeEmployee) };
}

export async function fetchAttendance(token?: string) {
  const resp = await request('/attendance', {}, token);
  const payload = resp?.data ?? resp;
  return { data: normalizeArray(payload, normalizeAttendance) };
}

export async function fetchAllAttendanceToday(token?: string) {
  const resp = await request('/attendance', {}, token);
  const payload = resp?.data ?? resp;
  return { data: normalizeArray(payload, normalizeAttendance) };
}

export async function fetchLeaveRequests(token?: string) {
  const resp = await request('/leave-requests', {}, token);
  const payload = resp?.data ?? resp;
  return { data: Array.isArray(payload) ? payload : (payload.data || []) };
}

export async function fetchPayroll(token?: string) {
  const resp = await request('/payroll', {}, token).catch(() => null);
  const payload = resp?.data ?? resp;
  return { data: Array.isArray(payload) ? payload : (payload.data || []) };
}

export async function fetchPromotions(token?: string) {
  const resp = await request('/promotions', {}, token).catch(() => null);
  const payload = resp?.data ?? resp;
  return { data: Array.isArray(payload) ? payload : (payload.data || []) };
}

export async function fetchPenalties(token?: string) {
  const resp = await request('/penalties', {}, token).catch(() => null);
  const payload = resp?.data ?? resp;
  return { data: Array.isArray(payload) ? payload : (payload.data || []) };
}

export async function fetchDashboardMetrics(token?: string) {
  const resp = await request('/dashboard/metrics', {}, token).catch(() => null);
  return resp?.data ?? resp ?? null;
}

export default { API_BASE };

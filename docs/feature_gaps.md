# Feature / Module Gap Matrix

Generated: 2026-05-12

| # | Feature / Module | Backend Status | Frontend Status | Gap Level |
|---:|---|---|---|---|
| 1 | Advanced Attendance Workflow | Full (draft, saved, submitted, acknowledged, unlock request & approval) | Basic marking only | ★★★★★ Very High |
| 2 | Attendance Submit to HO | Full API | Not implemented | ★★★★★ Very High |
| 3 | Attendance Unlock + HO Approval | Full flow | Not done | ★★★★★ Very High |
| 4 | Penalty Multi-level Approval | Propose → HR → HO → Employee Acknowledge | UI only (mock) | ★★★★★ Very High |
| 5 | Notifications + Pending Actions | Dedicated module + APIs | Only Announcements feed | ★★★★ High |
| 6 | Calendar Events | Full API (`/api/calendar`) | LocalStorage / Mock only | ★★★★ High |
| 7 | Multi-Step Employee Creation | 6 separate backend steps | Single form (`AddEmployee`) | ★★★★ High |
| 8 | Audit Logs & Activity Logs | Full tables + APIs | Page exists but mock data | ★★★★ High |
| 9 | Leave Capacity & Policy Engine | Department-wise capacity, overlap check, auto balance | Basic leave only | ★★★ High |
| 10 | Job History Automatic Tracking | Auto insert in `employee_job_history` | Manual promotions only | ★★★ High |

Notes:
- This matrix tracks backend coverage vs frontend implementation and prioritizes work.
- Use the todo list for implementation planning; high-priority items should be scheduled first.


## Feature / Module Gap Matrix

Generated: 2026-05-12

| # | Feature | Backend Status | Frontend Status | Gap |
|---:|---|---|---|---|
| 1 | Advanced Attendance States | Full (draft → submitted → acknowledged, unlock flow) | Basic only | ★★★★★ Very High |
| 2 | Attendance Submit to HO | API available | Not connected | ★★★★★ Very High |
| 3 | Attendance Unlock + Approval | Full workflow | Not implemented | ★★★★★ Very High |
| 4 | Penalty Multi-Level Workflow | Propose → Approve → Employee Acknowledge | UI only (mock data) | ★★★★★ Very High |
| 5 | Calendar Events | Full API (`/api/calendar`) | LocalStorage / Mock | ★★★★ High |
| 6 | Notifications System | Dedicated module + APIs | Announcements feed only | ★★★★ High |
| 7 | Multi-Step Employee Onboarding | 6 backend steps | Single form (`AddEmployee.tsx`) | ★★★★ High |
| 8 | Audit Log | Full backend support | Page exists but mock | ★★★★ High |
| 9 | Leave Capacity & Policy | Department-wise policy engine | Basic leave page only | ★★★ High |
| 10 | Job History Auto Tracking | Automatic in backend | Manual promotions only | ★★★ High |

Notes:
- This matrix reflects backend coverage vs current frontend implementation and prioritizes action items.
- Use the project todo list to create focused tasks for each high-priority item.


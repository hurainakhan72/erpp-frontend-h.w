# PR: Advanced Attendance States
Title: feat(attendance): implement advanced attendance states

Description:
Implement full attendance lifecycle: draft → saved → submitted → acknowledged. Add unlock request flow and approval by Branch HR / Head HR. Persist states in DataContext and ensure UI shows correct controls and badges.

Checklist:
- [ ] Add/extend types in src/context/DataContext.tsx
- [ ] Implement state transitions in src/pages/Attendance.tsx
- [ ] Add UI for sending sheet to HO and unlock requests
- [ ] Update src/pages/BranchHRDashboard.tsx to handle locks & approvals
- [ ] Add E2E tests to verify flows

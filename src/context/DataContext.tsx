import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  employees as defaultEmployees, Employee,
  attendanceData as defaultAttendance,
  allAttendanceToday as defaultAttToday,
  leaveRequests as defaultLeaveReqs,
  payrollData as defaultPayroll,
  promotions as defaultPromotions,
  penalties as defaultPenalties,
  auditLog as defaultAuditLog,
  hrAccounts as defaultHrAccounts,
  departments as defaultDepts,
  designations as defaultDesigs,
  workModes as defaultWorkModes,
  workLocations as defaultWorkLocs,
  employmentTypes as defaultEmpTypes,
  jobStatuses as defaultJobStatuses,
  shifts as defaultShifts,
  dutyRosterData as defaultDutyRosterData,
  dutyRosterTemplates as defaultDutyRosterTemplates,
  leaveTypes as defaultLeaveTypes,
  leavePolicies as defaultLeavePolicies,
  payrollComponents as defaultPayrollComps,
  penaltiesConfig as defaultPenaltiesConfig,
  reportingManagers as defaultReportingMgrs,
  customFields as defaultCustomFields,
  taxConfig as defaultTaxConfig,
  globalDays as defaultGlobalDays,
} from '../services/api';

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem('ems_' + key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: any) {
  localStorage.setItem('ems_' + key, JSON.stringify(value));
}

export type AttendanceLockStatus =
  | 'unlocked'
  | 'locked'
  | 'branch_locked'
  | 'head_locked'
  | 'finalized';

export interface AttendanceLock {
  status: AttendanceLockStatus | 'rejected';
  lockedBy: string;
  lockedAt: string;
  branch?: string;
  date?: string;
  // optional arrays for unlock requests and approvals
  unlockRequests?: string[];
  unlockedEmployees?: string[];
  // finalized / verified metadata
  verifiedBy?: string;
  verifiedAt?: string;
  reason?: string;
  // optional sheet snapshot
  sheet?: any[];
}

interface DataContextType {
  employees: Employee[];
  setEmployees: (fn: (prev: Employee[]) => Employee[]) => void;
  addEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  leaveRequests: any[];
  setLeaveRequests: (fn: (prev: any[]) => any[]) => void;
  payrollData: any[];
  setPayrollData: (fn: (prev: any[]) => any[]) => void;
  promotions: any[];
  setPromotions: (fn: (prev: any[]) => any[]) => void;
  penalties: any[];
  setPenalties: (fn: (prev: any[]) => any[]) => void;
  auditLog: any[];
  setAuditLog: (fn: (prev: any[]) => any[]) => void;
  hrAccounts: any[];
  setHrAccounts: (fn: (prev: any[]) => any[]) => void;
  attendanceData: any[];
  setAttendanceData: (fn: (prev: any[]) => any[]) => void;
  allAttendanceToday: any[];
  setAllAttendanceToday: (fn: (prev: any[]) => any[]) => void;
  attendanceLocks: Record<string, AttendanceLock>;
  setAttendanceLocks: (fn: (prev: Record<string, AttendanceLock>) => Record<string, AttendanceLock>) => void;
  // helpers for attendance workflow
  submitAttendanceSheet: (branchId: string, sheet: any[], user?: string, date?: string) => void;
  requestUnlock: (branchId: string, empCode: string, user?: string) => void;
  approveUnlock: (branchId: string, empCode: string, approver?: string) => void;
  departments: string[];
  setDepartments: (fn: (prev: string[]) => string[]) => void;
  designations: string[];
  setDesignations: (fn: (prev: string[]) => string[]) => void;
  workModes: string[];
  setWorkModes: (fn: (prev: string[]) => string[]) => void;
  workLocations: string[];
  setWorkLocations: (fn: (prev: string[]) => string[]) => void;
  employmentTypes: string[];
  setEmploymentTypes: (fn: (prev: string[]) => string[]) => void;
  jobStatuses: string[];
  setJobStatuses: (fn: (prev: string[]) => string[]) => void;
  reportingManagers: string[];
  setReportingManagers: (fn: (prev: string[]) => string[]) => void;
  shifts: typeof defaultShifts;
  setShifts: (fn: (prev: typeof defaultShifts) => typeof defaultShifts) => void;
  dutyRosterData: any[];
  setDutyRosterData: (fn: (prev: any[]) => any[]) => void;
  dutyRosterTemplates: any[];
  setDutyRosterTemplates: (fn: (prev: any[]) => any[]) => void;
  leaveTypes: typeof defaultLeaveTypes;
  setLeaveTypes: (fn: (prev: typeof defaultLeaveTypes) => typeof defaultLeaveTypes) => void;
  leavePolicies: typeof defaultLeavePolicies;
  setLeavePolicies: (fn: (prev: typeof defaultLeavePolicies) => typeof defaultLeavePolicies) => void;
  payrollComponents: typeof defaultPayrollComps;
  setPayrollComponents: (fn: (prev: typeof defaultPayrollComps) => typeof defaultPayrollComps) => void;
  penaltiesConfig: typeof defaultPenaltiesConfig;
  setPenaltiesConfig: (fn: (prev: typeof defaultPenaltiesConfig) => typeof defaultPenaltiesConfig) => void;
  customFields: typeof defaultCustomFields;
  setCustomFields: (fn: (prev: typeof defaultCustomFields) => typeof defaultCustomFields) => void;
  taxConfig: typeof defaultTaxConfig;
  setTaxConfig: (fn: (prev: typeof defaultTaxConfig) => typeof defaultTaxConfig) => void;
  globalDays: typeof defaultGlobalDays;
  setGlobalDays: (fn: (prev: typeof defaultGlobalDays) => typeof defaultGlobalDays) => void;
  savedReports: any[];
  setSavedReports: (fn: (prev: any[]) => any[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function usePersisted<T>(key: string, fallback: T): [T, (fn: (prev: T) => T) => void] {
  const [state, setState] = useState<T>(() => load(key, fallback));
  const update = useCallback((fn: (prev: T) => T) => {
    setState(prev => {
      const next = fn(prev);
      save(key, next);
      return next;
    });
  }, [key]);
  return [state, update];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = usePersisted('employees', defaultEmployees);
  const [leaveRequests, setLeaveRequests] = usePersisted('leaveRequests', defaultLeaveReqs);
  const [payrollData, setPayrollData] = usePersisted('payrollData', defaultPayroll);
  const [promotions, setPromotions] = usePersisted('promotions', defaultPromotions);
  const [penalties, setPenalties] = usePersisted('penalties', defaultPenalties);
  const [auditLog, setAuditLog] = usePersisted('auditLog', defaultAuditLog);
  const [hrAccounts, setHrAccounts] = usePersisted('hrAccounts', defaultHrAccounts);
  const [attendanceData, setAttendanceData] = usePersisted('attendanceData', defaultAttendance);
  const [allAttendanceToday, setAllAttendanceToday] = usePersisted('allAttendanceToday', defaultAttToday);
  const [attendanceLocks, setAttendanceLocks] = usePersisted<Record<string, AttendanceLock>>('attendanceLocks', {});
  const [departments, setDepartments] = usePersisted('departments', defaultDepts);
  const [designations, setDesignations] = usePersisted('designations', defaultDesigs);
  const [workModes, setWorkModes] = usePersisted('workModes', defaultWorkModes);
  const [workLocations, setWorkLocations] = usePersisted('workLocations', defaultWorkLocs);
  const [employmentTypes, setEmploymentTypes] = usePersisted('employmentTypes', defaultEmpTypes);
  const [jobStatuses, setJobStatuses] = usePersisted('jobStatuses', defaultJobStatuses);
  const [reportingManagers, setReportingManagers] = usePersisted('reportingManagers', defaultReportingMgrs);
  const [shifts, setShifts] = usePersisted('shifts', defaultShifts);
  const [dutyRosterData, setDutyRosterData] = usePersisted('dutyRosterData', defaultDutyRosterData);
  const [dutyRosterTemplates, setDutyRosterTemplates] = usePersisted('dutyRosterTemplates', defaultDutyRosterTemplates);
  const [leaveTypes, setLeaveTypes] = usePersisted('leaveTypes', defaultLeaveTypes);
  const [leavePolicies, setLeavePolicies] = usePersisted('leavePolicies', defaultLeavePolicies);
  const [payrollComponents, setPayrollComponents] = usePersisted('payrollComponents', defaultPayrollComps);
  const [penaltiesConfig, setPenaltiesConfig] = usePersisted('penaltiesConfig', defaultPenaltiesConfig);
  const [customFields, setCustomFields] = usePersisted('customFields', defaultCustomFields);
  const [taxConfig, setTaxConfig] = usePersisted('taxConfig', defaultTaxConfig);
  const [globalDays, setGlobalDays] = usePersisted('globalDays', defaultGlobalDays);
  const [savedReports, setSavedReports] = usePersisted('savedReports', [] as any[]);

  const addEmployee = useCallback((emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
  }, [setEmployees]);

  const logAction = useCallback((action: string, meta?: any) => {
    const entry = { id: 'a' + Date.now(), action, meta: meta || {}, at: new Date().toISOString() };
    setAuditLog(prev => [...prev, entry]);
  }, [setAuditLog]);

  const submitAttendanceSheet = useCallback((branchId: string, sheet: any[], user?: string, date?: string) => {
    const now = new Date().toISOString();
    setAttendanceLocks(prev => {
      const existing = prev[branchId] || {} as AttendanceLock;
      return {
        ...prev,
        [branchId]: {
          ...existing,
          status: 'branch_locked',
          lockedBy: user || existing.lockedBy || 'branch_hr',
          lockedAt: now,
          branch: branchId,
          date: date || existing.date || now.slice(0,10),
          sheet: sheet || existing.sheet || [],
        }
      };
    });
  }, [setAttendanceLocks]);

  const requestUnlock = useCallback((branchId: string, empCode: string, user?: string) => {
    const now = new Date().toISOString();
    setAttendanceLocks(prev => {
      const existing = prev[branchId] || {} as AttendanceLock;
      const unlocks = Array.isArray(existing.unlockRequests) ? existing.unlockRequests.slice() : [];
      if (!unlocks.includes(empCode)) unlocks.push(empCode);
      return {
        ...prev,
        [branchId]: {
          ...existing,
          unlockRequests: unlocks,
          status: existing.status === 'finalized' ? existing.status : 'branch_locked',
          lockedBy: existing.lockedBy || user || 'requestor',
          lockedAt: existing.lockedAt || now,
        }
      };
    });
  }, [setAttendanceLocks]);

  const approveUnlock = useCallback((branchId: string, empCode: string, approver?: string) => {
    setAttendanceLocks(prev => {
      const existing = prev[branchId] || {} as AttendanceLock;
      const unlocks = Array.isArray(existing.unlockRequests) ? existing.unlockRequests.filter(c => c !== empCode) : [];
      const unlocked = Array.isArray(existing.unlockedEmployees) ? existing.unlockedEmployees.slice() : [];
      if (!unlocked.includes(empCode)) unlocked.push(empCode);
      return {
        ...prev,
        [branchId]: {
          ...existing,
          unlockRequests: unlocks,
          unlockedEmployees: unlocked,
        }
      };
    });
  }, [setAttendanceLocks]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, [setEmployees]);

  return (
    <DataContext.Provider value={{
      employees, setEmployees, addEmployee, deleteEmployee,
      leaveRequests, setLeaveRequests,
      payrollData, setPayrollData,
      promotions, setPromotions,
      penalties, setPenalties,
      auditLog, setAuditLog,
      hrAccounts, setHrAccounts,
      attendanceData, setAttendanceData,
      allAttendanceToday, setAllAttendanceToday,
      attendanceLocks, setAttendanceLocks,
      submitAttendanceSheet,
      requestUnlock,
      approveUnlock,
      departments, setDepartments,
      designations, setDesignations,
      workModes, setWorkModes,
      workLocations, setWorkLocations,
      employmentTypes, setEmploymentTypes,
      jobStatuses, setJobStatuses,
      reportingManagers, setReportingManagers,
      shifts, setShifts,
      dutyRosterData, setDutyRosterData,
      dutyRosterTemplates, setDutyRosterTemplates,
      leaveTypes, setLeaveTypes,
      leavePolicies, setLeavePolicies,
      payrollComponents, setPayrollComponents,
      penaltiesConfig, setPenaltiesConfig,
      customFields, setCustomFields,
      taxConfig, setTaxConfig,
      globalDays, setGlobalDays,
      savedReports, setSavedReports,
      logAction,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}





















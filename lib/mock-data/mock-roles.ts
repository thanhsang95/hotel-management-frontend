import { Role } from '../types';
import { PERMISSIONS_LIST } from './permissions-list';

// ==========================================
// Mock Roles Generator
// Predefined roles: Admin, Manager, Receptionist
// ==========================================

/**
 * Get all permission IDs for full system access
 */
const getAllPermissionIds = (): string[] => {
  return PERMISSIONS_LIST.map((p) => p.id);
};

/**
 * Get permission IDs for specific modules
 */
const getPermissionIdsForModules = (modules: string[]): string[] => {
  return PERMISSIONS_LIST
    .filter((p) => modules.includes(p.module))
    .map((p) => p.id);
};

/**
 * Get view-only permission IDs for specific modules
 */
const getViewOnlyPermissionIds = (modules: string[]): string[] => {
  return PERMISSIONS_LIST
    .filter((p) => modules.includes(p.module) && p.code.endsWith('_VIEW'))
    .map((p) => p.id);
};

// ==========================================
// Predefined Roles
// ==========================================

export const MOCK_ROLES: Role[] = [
  {
    id: 'role-1',
    name: 'Admin',
    description: 'Quản trị viên hệ thống với toàn quyền truy cập',
    permissionIds: getAllPermissionIds(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-2',
    name: 'Manager',
    description: 'Quản lý với quyền quản lý phòng, giá, marketing và đối tác',
    permissionIds: [
      ...getPermissionIdsForModules([
        'Dashboard',
        'Đặt phòng',
        'Lễ tân',
        'Phòng',
        'Giá & Tiền tệ',
        'Marketing',
        'Đối tác',
      ]),
      // Report permissions
      '37', // REPORT_DASH_VIEW
      '38', // REPORT_RES_VIEW
      '39', // REPORT_ROOM_VIEW
      '40', // REPORT_PRICE_VIEW
      '41', // REPORT_MKT_VIEW
      '42', // REPORT_PARTNER_VIEW
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-3',
    name: 'Receptionist',
    description: 'Lễ tân với quyền đặt phòng và check-in/out',
    permissionIds: [
      // Full access to reception and reservations
      ...getPermissionIdsForModules(['Lễ tân', 'Đặt phòng']),
      // View-only for other modules
      ...getViewOnlyPermissionIds(['Dashboard', 'Phòng', 'Đối tác']),
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-4',
    name: 'Housekeeping',
    description: 'Nhân viên dọn phòng với quyền cập nhật trạng thái phòng',
    permissionIds: [
      // View dashboard
      ...getViewOnlyPermissionIds(['Dashboard']),
      // Full access to rooms
      ...getPermissionIdsForModules(['Phòng']),
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-5',
    name: 'Accountant',
    description: 'Kế toán với quyền xem báo cáo và quản lý tiền tệ',
    permissionIds: [
      // Full access to pricing
      ...getPermissionIdsForModules(['Giá & Tiền tệ']),
      // View-only for other modules
      ...getViewOnlyPermissionIds(['Dashboard', 'Đặt phòng', 'Đối tác']),
      // Report permissions
      '37', // REPORT_DASH_VIEW
      '40', // REPORT_PRICE_VIEW
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get role by ID
 */
export const getRoleById = (id: string): Role | undefined => {
  return MOCK_ROLES.find((r) => r.id === id);
};

/**
 * Get role by name
 */
export const getRoleByName = (name: string): Role | undefined => {
  return MOCK_ROLES.find((r) => r.name.toLowerCase() === name.toLowerCase());
};

/**
 * Get all roles
 */
export const getAllRoles = (): Role[] => {
  return [...MOCK_ROLES];
};

/**
 * Create a mutable copy of roles for CRUD operations
 */
let rolesState = [...MOCK_ROLES];

export const getRolesState = (): Role[] => [...rolesState];

export const addRole = (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role => {
  const newRole: Role = {
    ...role,
    id: `role-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  rolesState.push(newRole);
  return newRole;
};

export const updateRole = (id: string, updates: Partial<Role>): Role | undefined => {
  const index = rolesState.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  
  rolesState[index] = {
    ...rolesState[index],
    ...updates,
    updatedAt: new Date(),
  };
  return rolesState[index];
};

export const deleteRole = (id: string): boolean => {
  const index = rolesState.findIndex((r) => r.id === id);
  if (index === -1) return false;
  
  rolesState.splice(index, 1);
  return true;
};

export const resetRolesState = (): void => {
  rolesState = [...MOCK_ROLES];
};

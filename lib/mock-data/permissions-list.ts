import { Permission } from '../types';

// ==========================================
// Master Permission List
// Organized by Module
// ==========================================

// Helper to generate standard CRUD permissions for a module
const generateModulePermissions = (
  module: string,
  moduleCode: string,
  startId: number
): Permission[] => {
  return [
    {
      id: `${startId}`,
      code: `${moduleCode}_VIEW`,
      label: 'Xem',
      module,
      description: `Quyền xem ${module}`,
    },
    {
      id: `${startId + 1}`,
      code: `${moduleCode}_CREATE`,
      label: 'Tạo mới',
      module,
      description: `Quyền tạo ${module}`,
    },
    {
      id: `${startId + 2}`,
      code: `${moduleCode}_EDIT`,
      label: 'Chỉnh sửa',
      module,
      description: `Quyền sửa ${module}`,
    },
    {
      id: `${startId + 3}`,
      code: `${moduleCode}_DELETE`,
      label: 'Xóa',
      module,
      description: `Quyền xóa ${module}`,
    },
  ];
};

// ==========================================
// Module Definitions
// ==========================================

export const PERMISSION_MODULES = [
  'Dashboard',
  'Đặt phòng',
  'Lễ tân',
  'Phòng',
  'Giá & Tiền tệ',
  'Marketing',
  'Đối tác',
  'Nhân viên',
  'Cấu hình',
  'Báo cáo',
] as const;

export type PermissionModule = typeof PERMISSION_MODULES[number];

// ==========================================
// All Permissions
// ==========================================

export const PERMISSIONS_LIST: Permission[] = [
  // Dashboard (1-4)
  ...generateModulePermissions('Dashboard', 'DASH', 1),
  
  // Reservations / Đặt phòng (5-8)
  ...generateModulePermissions('Đặt phòng', 'RES', 5),
  
  // Reception / Lễ tân (9-12)
  ...generateModulePermissions('Lễ tân', 'REC', 9),
  
  // Rooms / Phòng (13-16)
  ...generateModulePermissions('Phòng', 'ROOM', 13),
  
  // Pricing & Currency / Giá & Tiền tệ (17-20)
  ...generateModulePermissions('Giá & Tiền tệ', 'PRICE', 17),
  
  // Marketing (21-24)
  ...generateModulePermissions('Marketing', 'MKT', 21),
  
  // Partners / Đối tác (25-28)
  ...generateModulePermissions('Đối tác', 'PARTNER', 25),
  
  // Employees / Nhân viên (29-32)
  ...generateModulePermissions('Nhân viên', 'EMP', 29),
  
  // Settings / Cấu hình (33-36)
  ...generateModulePermissions('Cấu hình', 'CONFIG', 33),
  
  // Reports / Báo cáo (37-43) - View-only permissions per functional area
  {
    id: '37',
    code: 'REPORT_DASH_VIEW',
    label: 'Báo cáo Dashboard',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Dashboard',
  },
  {
    id: '38',
    code: 'REPORT_RES_VIEW',
    label: 'Báo cáo Đặt phòng',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Đặt phòng',
  },
  {
    id: '39',
    code: 'REPORT_ROOM_VIEW',
    label: 'Báo cáo Phòng',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Phòng',
  },
  {
    id: '40',
    code: 'REPORT_PRICE_VIEW',
    label: 'Báo cáo Giá & Tiền tệ',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Giá & Tiền tệ',
  },
  {
    id: '41',
    code: 'REPORT_MKT_VIEW',
    label: 'Báo cáo Marketing',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Marketing',
  },
  {
    id: '42',
    code: 'REPORT_PARTNER_VIEW',
    label: 'Báo cáo Đối tác',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Đối tác',
  },
  {
    id: '43',
    code: 'REPORT_EMP_VIEW',
    label: 'Báo cáo Nhân viên',
    module: 'Báo cáo',
    description: 'Quyền xem báo cáo Nhân viên',
  },
];

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get all permissions for a specific module
 */
export const getPermissionsByModule = (module: string): Permission[] => {
  return PERMISSIONS_LIST.filter((p) => p.module === module);
};

/**
 * Get permissions grouped by module
 */
export const getPermissionsGroupedByModule = (): Record<string, Permission[]> => {
  return PERMISSIONS_LIST.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

/**
 * Get a permission by its code
 */
export const getPermissionByCode = (code: string): Permission | undefined => {
  return PERMISSIONS_LIST.find((p) => p.code === code);
};

/**
 * Get permission by ID
 */
export const getPermissionById = (id: string): Permission | undefined => {
  return PERMISSIONS_LIST.find((p) => p.id === id);
};

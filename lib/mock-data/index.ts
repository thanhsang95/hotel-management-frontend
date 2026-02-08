// Central export for all mock data
export { MOCK_CHANNELS } from './channels';
export { MOCK_COMPANY_PROFILES } from './companyProfiles';
export { MOCK_CURRENCIES } from './currencies';
export { MOCK_CURRENCY_RATES } from './currencyRates';
export { MOCK_DASHBOARD_DATA } from './dashboard';
export { MOCK_HOTELS } from './hotels';
export { MOCK_MARKET_SEGMENTS } from './marketSegments';
export { MOCK_BOOKINGS } from './mock-bookings';
export { MOCK_RESERVATIONS } from './mock-reservations';
export { MOCK_RATE_CODES } from './rateCodes';
export { MOCK_ROOM_STATUS_DEFINITIONS } from './room-status-definitions';
export { MOCK_ROOM_CATEGORIES } from './roomCategories';
export { MOCK_ROOMS } from './rooms';
export { MOCK_ROOM_TYPES } from './roomTypes';
export { MOCK_SOURCE_CODES } from './sourceCodes';

// RBAC / Employee Management
export { MOCK_DEPARTMENTS, MOCK_EMPLOYEES, addEmployee, deleteEmployee, getAllDepartments, getDepartmentById, getEmployeeById, getEmployeeByUsername, getEmployeesState, isUsernameUnique, resetEmployeesState, updateEmployee } from './mock-employees';
export { MOCK_ROLES, addRole, deleteRole, getAllRoles, getRoleById, getRoleByName, getRolesState, resetRolesState, updateRole } from './mock-roles';
export { PERMISSIONS_LIST, PERMISSION_MODULES, getPermissionByCode, getPermissionById, getPermissionsByModule, getPermissionsGroupedByModule } from './permissions-list';


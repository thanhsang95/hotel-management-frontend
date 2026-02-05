import { AccountStatus, Employee, EmployeeStatus, Gender } from '../types';

// ==========================================
// Mock Employees Generator
// Generates realistic Vietnamese employee data
// ==========================================

// Vietnamese names data
const LAST_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Mai', 'Lương',
];

const MIDDLE_NAMES = [
  'Văn', 'Thị', 'Hữu', 'Đức', 'Minh', 'Quốc', 'Anh', 'Thanh', 'Hoàng', 'Kim',
  'Ngọc', 'Thành', 'Xuân', 'Thu', 'Hà', 'Phương', 'Quang', 'Như', 'Bích', 'Cẩm',
];

const FIRST_NAMES_MALE = [
  'Hùng', 'Dũng', 'Tuấn', 'Hoàng', 'Long', 'Đức', 'Minh', 'Phong', 'Trung', 'Quân',
  'Tùng', 'Hải', 'Sơn', 'Bình', 'Thắng', 'Nam', 'Khoa', 'Hưng', 'Phúc', 'Tín',
];

const FIRST_NAMES_FEMALE = [
  'Hương', 'Lan', 'Linh', 'Mai', 'Nhung', 'Thảo', 'Hạnh', 'Yến', 'Phương', 'Trang',
  'Ngọc', 'Hà', 'Thu', 'Xuân', 'Vy', 'Nhi', 'Trinh', 'Chi', 'My', 'Quỳnh',
];

const DEPARTMENTS = [
  { id: 'dept-1', name: 'Lễ tân' },
  { id: 'dept-2', name: 'Buồng phòng' },
  { id: 'dept-3', name: 'Nhà hàng' },
  { id: 'dept-4', name: 'Kế toán' },
  { id: 'dept-5', name: 'Bảo vệ' },
  { id: 'dept-6', name: 'Quản lý' },
];

const POSITIONS: Record<string, string[]> = {
  'dept-1': ['Nhân viên lễ tân', 'Tổ trưởng lễ tân', 'Giám sát lễ tân'],
  'dept-2': ['Nhân viên buồng phòng', 'Tổ trưởng buồng phòng', 'Giám sát buồng phòng'],
  'dept-3': ['Nhân viên phục vụ', 'Bếp trưởng', 'Quản lý nhà hàng'],
  'dept-4': ['Kế toán viên', 'Kế toán trưởng'],
  'dept-5': ['Nhân viên bảo vệ', 'Tổ trưởng bảo vệ'],
  'dept-6': ['Trợ lý quản lý', 'Phó giám đốc', 'Giám đốc'],
};

// ==========================================
// Helper Functions
// ==========================================

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const generateVietnamesePhone = (): string => {
  const prefixes = ['090', '091', '092', '093', '094', '096', '097', '098', '099', '086', '083', '084', '085', '088', '089'];
  const prefix = randomElement(prefixes);
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
};

const generateUsername = (fullName: string, index: number): string => {
  // Remove Vietnamese diacritics
  const normalized = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '.');
  
  return `${normalized}${index}`;
};

// ==========================================
// Generate Single Employee
// ==========================================

const generateEmployee = (index: number): Employee => {
  const gender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const lastName = randomElement(LAST_NAMES);
  const middleName = randomElement(MIDDLE_NAMES);
  const firstName = gender === 'Male' 
    ? randomElement(FIRST_NAMES_MALE) 
    : randomElement(FIRST_NAMES_FEMALE);
  
  const fullName = `${lastName} ${middleName} ${firstName}`;
  const department = randomElement(DEPARTMENTS);
  const positions = POSITIONS[department.id] || ['Nhân viên'];
  const position = randomElement(positions);
  
  const dob = randomDate(new Date('1975-01-01'), new Date('2000-12-31'));
  const joinDate = randomDate(new Date('2020-01-01'), new Date('2024-12-31'));
  
  const statuses: EmployeeStatus[] = ['Active', 'Active', 'Active', 'Active', 'Inactive']; // 80% active
  const accountStatuses: AccountStatus[] = ['Active', 'Active', 'Active', 'Locked']; // 75% active
  
  const code = `NV${String(index + 1).padStart(4, '0')}`;
  
  return {
    id: `emp-${index + 1}`,
    code,
    fullName,
    gender,
    dob: formatDate(dob),
    phone: generateVietnamesePhone(),
    email: `${generateUsername(fullName, index + 1).replace('.', '')}@hotel.vn`,
    address: `${Math.floor(Math.random() * 200) + 1} Đường ${randomElement(['Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Hai Bà Trưng', 'Điện Biên Phủ', 'Pasteur'])}, TP.HCM`,
    departmentId: department.id,
    position,
    joinDate: formatDate(joinDate),
    status: randomElement(statuses),
    notes: Math.random() > 0.7 ? 'Ghi chú mẫu cho nhân viên' : undefined,
    username: generateUsername(fullName, index + 1),
    accountStatus: randomElement(accountStatuses),
    roleIds: index === 0 
      ? ['role-1'] // First employee is Admin
      : index < 3 
        ? ['role-2'] // Next 2 are Managers
        : index < 8 
          ? ['role-3'] // Next 5 are Receptionists
          : Math.random() > 0.5 
            ? ['role-4'] // Housekeeping
            : ['role-5'], // Accountant
    createdAt: new Date(joinDate),
    updatedAt: new Date(),
  };
};

// ==========================================
// Mock Employees Data
// ==========================================

export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 15 }, (_, i) => generateEmployee(i));

// Override first few employees for consistency
MOCK_EMPLOYEES[0] = {
  ...MOCK_EMPLOYEES[0],
  fullName: 'Nguyễn Văn Admin',
  username: 'admin',
  email: 'admin@hotel.vn',
  position: 'Giám đốc',
  departmentId: 'dept-6',
  roleIds: ['role-1'],
};

MOCK_EMPLOYEES[1] = {
  ...MOCK_EMPLOYEES[1],
  fullName: 'Trần Thị Manager',
  username: 'manager',
  email: 'manager@hotel.vn',
  position: 'Phó giám đốc',
  departmentId: 'dept-6',
  roleIds: ['role-2'],
};

MOCK_EMPLOYEES[2] = {
  ...MOCK_EMPLOYEES[2],
  fullName: 'Lê Văn Reception',
  username: 'reception',
  email: 'reception@hotel.vn',
  position: 'Giám sát lễ tân',
  departmentId: 'dept-1',
  roleIds: ['role-3'],
};

// ==========================================
// CRUD State Management
// ==========================================

let employeesState = [...MOCK_EMPLOYEES];

export const getEmployeesState = (): Employee[] => [...employeesState];

export const getEmployeeById = (id: string): Employee | undefined => {
  return employeesState.find((e) => e.id === id);
};

export const getEmployeeByUsername = (username: string): Employee | undefined => {
  return employeesState.find((e) => e.username.toLowerCase() === username.toLowerCase());
};

export const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee => {
  const newEmployee: Employee = {
    ...employee,
    id: `emp-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  employeesState.push(newEmployee);
  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): Employee | undefined => {
  const index = employeesState.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  
  employeesState[index] = {
    ...employeesState[index],
    ...updates,
    updatedAt: new Date(),
  };
  return employeesState[index];
};

export const deleteEmployee = (id: string): boolean => {
  const index = employeesState.findIndex((e) => e.id === id);
  if (index === -1) return false;
  
  employeesState.splice(index, 1);
  return true;
};

export const resetEmployeesState = (): void => {
  employeesState = [...MOCK_EMPLOYEES];
};

export const isUsernameUnique = (username: string, excludeId?: string): boolean => {
  return !employeesState.some(
    (e) => e.username.toLowerCase() === username.toLowerCase() && e.id !== excludeId
  );
};

// ==========================================
// Department Helpers
// ==========================================

export const MOCK_DEPARTMENTS = DEPARTMENTS;

export const getDepartmentById = (id: string): { id: string; name: string } | undefined => {
  return DEPARTMENTS.find((d) => d.id === id);
};

export const getAllDepartments = () => [...DEPARTMENTS];

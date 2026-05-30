import { 
  Users, 
  Bed, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Search, 
  Bell, 
  Moon, 
  LayoutDashboard, 
  UserRound, 
  CalendarDays, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LifeBuoy, 
  LogOut,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Plus,
  Hospital,
  User
} from 'lucide-react';

export const ICONS = {
  Users,
  Bed,
  Calendar,
  DollarSign,
  MessageSquare,
  Search,
  Bell,
  Moon,
  Hospital,
  User,
  Dashboard: LayoutDashboard,
  Patients: UserRound,
  Appointments: CalendarDays,
  Billing: CreditCard,
  Reports: BarChart3,
  Settings,
  Support: LifeBuoy,
  LogOut,
  More: MoreHorizontal,
  Check: CheckCircle2,
  Clock,
  Plus
};

export const NAVIGATION = [
  { 
    name: 'Dashboard', 
    icon: 'Dashboard', 
    path: '/',
    roles: ['Doctor', 'Pharmacist', 'Accountant', 'Admin', 'Receptionist']
  },
  { 
    name: 'Patient Management', 
    icon: 'Patients', 
    path: '/patients',
    roles: ['Doctor', 'Admin', 'Receptionist'],
    submenus: ['Register New Patient', 'Patient List', 'Patient History']
  },
  { 
    name: 'Appointments', 
    icon: 'Appointments', 
    path: '/appointments',
    roles: ['Doctor', 'Admin', 'Receptionist'],
    submenus: ['Book Appointment', 'Calendar', 'Doctor Schedule']
  },
  { 
    name: 'OPD', 
    icon: 'Clock', 
    path: '/opd',
    roles: ['Doctor', 'Admin', 'Receptionist'],
    submenus: ['Registration', 'Clinical Exam', 'Eye Tests', 'Diagnosis', 'Billing']
  },
  { 
    name: 'IPD', 
    icon: 'Bed', 
    path: '/ipd',
    roles: ['Doctor', 'Admin', 'Receptionist'],
    submenus: ['Registration', 'Bed Allotment', 'Surgery Details', 'Discharge']
  },
  { 
    name: 'Surgery / OT', 
    icon: 'Check', 
    path: '/surgery',
    roles: ['Doctor', 'Admin'],
    submenus: ['Schedule Surgery', 'OT Checklist', 'Surgical Record']
  },
  { 
    name: 'Pharmacy', 
    icon: 'More', 
    path: '/pharmacy',
    roles: ['Pharmacist', 'Admin', 'Receptionist'],
    submenus: ['Inventory', 'Sales Billing']
  },
  { 
    name: 'Optical Store', 
    icon: 'Search', 
    path: '/optical',
    roles: ['Pharmacist', 'Accountant', 'Admin', 'Receptionist'],
    submenus: ['Inventory', 'Billing']
  },
  { 
    name: 'Billing & Payments', 
    icon: 'Billing', 
    path: '/billing',
    roles: ['Accountant', 'Admin', 'Receptionist'],
    submenus: ['OPD Billing', 'IPD Billing', 'Pharmacy/Optical']
  },
  { 
    name: 'Reports', 
    icon: 'Reports', 
    path: '/reports',
    roles: ['Doctor', 'Pharmacist', 'Accountant', 'Admin', 'Receptionist']
  },
  { 
    name: 'Settings', 
    icon: 'Settings', 
    path: '/settings',
    roles: ['Admin']
  },
];

export const MOCK_USERS = [
  { id: '1', name: 'Dr. Anita Kumar', username: 'doctor', password: '123', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita' },
  { id: '2', name: 'Pharmacist Rahul', username: 'pharmacist', password: '123', role: 'Pharmacist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: '3', name: 'Accountant Ajay', username: 'accountant', password: '123', role: 'Accountant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ajay' },
  { id: '4', name: 'Super Admin', username: 'admin', password: '123', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  { id: '5', name: 'Receptionist Sneha', username: 'receptionist', password: '123', role: 'Receptionist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
];

export const MOCK_STATS = [
  { title: 'Total Staff', value: '85', icon: 'Users', color: 'bg-brand-secondary' },
  { title: 'IPD Patients', value: '42', icon: 'Bed', color: 'bg-[#F28C5E]' }, // Custom orange from image
  { title: 'Appointments Today', value: '18', icon: 'Calendar', color: 'bg-brand-accent-blue' },
  { title: 'Revenue This Month', value: '₹7,50,000', icon: 'DollarSign', color: 'bg-brand-accent-green' },
  { title: 'Messages', value: '5', icon: 'MessageSquare', color: 'bg-white text-slate-900 border border-slate-200' },
];

export const MOCK_ADMISSIONS = [
  { id: '1', name: 'Neha Gupta', fatherName: 'Mr. S.P. Gupta', mobile: '+91 98765 43210', treatment: 'Cataract Surgery', date: '02/05/2026', age: 45, gender: 'Female', avatar: 'https://i.pravatar.cc/150?u=neha', vitals: { bp: '120/80', pulse: '72', weight: '65kg', temp: '98.6F', spo2: '98%' } },
  { id: '2', name: 'Rajesh Verma', fatherName: 'Mr. L.K. Verma', mobile: '+91 87654 32109', treatment: 'Glaucoma Treatment', date: '02/05/2026', age: 62, gender: 'Male', avatar: 'https://i.pravatar.cc/150?u=rajesh', vitals: { bp: '140/90', pulse: '84', weight: '78kg', temp: '98.2F', spo2: '96%' } },
  { id: '3', name: 'Amit Patel', fatherName: 'Mr. R.P. Patel', mobile: '+91 76543 21098', treatment: 'Retinal Detachment', date: '01/04/2026', age: 38, gender: 'Male', avatar: 'https://i.pravatar.cc/150?u=amit', vitals: { bp: '118/76', pulse: '70', weight: '72kg', temp: '98.4F', spo2: '99%' } },
  { id: '4', name: 'Priya Soni', fatherName: 'Mr. D.K. Soni', mobile: '+91 65432 10987', treatment: 'Pediatric Checkup', date: '31/03/2026', age: 12, gender: 'Female', avatar: 'https://i.pravatar.cc/150?u=priya', vitals: { bp: '100/60', pulse: '88', weight: '34kg', temp: '99.1F', spo2: '97%' } },
];

export const MOCK_TASKS = [
  { id: '1', title: 'Prepare OT for Surgery', completed: false },
  { id: '2', title: 'Update Patient Records', completed: false },
  { id: '3', title: 'Order Medical Supplies', completed: false },
];

export const MOCK_APPOINTMENTS = [
  { id: '1', time: '10:00 AM', doctor: 'Dr. Mehta', patient: 'Cataract Consultation', color: 'bg-brand-secondary' },
  { id: '2', time: '11:45 AM', doctor: 'Dr. Kumar', patient: 'Glaucoma Follow-up', color: 'bg-brand-accent-blue' },
  { id: '3', time: '2:15 PM', doctor: 'Dr. Sharma', patient: 'Retinal Scan', color: 'bg-brand-accent-orange' },
];

export const CHART_DATA = [
  { name: 'Mon', value: 3.5 },
  { name: 'Tue', value: 4.8 },
  { name: 'Wed', value: 4.2 },
  { name: 'Thu', value: 5.6 },
  { name: 'Fri', value: 5.1 },
  { name: 'Sat', value: 4.9 },
  { name: 'Sun', value: 6.2 },
];

export const PIE_DATA = [
  { name: 'Occupied', value: 60, color: '#0E848F' },
  { name: 'Vacant', value: 25, color: '#3B82F6' },
  { name: 'Under Maintenance', value: 15, color: '#F59E0B' },
];

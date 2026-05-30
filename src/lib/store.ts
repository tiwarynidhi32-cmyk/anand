import { MOCK_ADMISSIONS } from '../constants';

// Basic shared state for demo persistence
export const getBills = () => {
  const saved = localStorage.getItem('hospital_bills');
  if (saved) return JSON.parse(saved);
  
  // Default mock data
  return [
    { id: 'B-2001', patient: 'Neha Gupta', type: 'IPD', date: '02/05/2026', items: 12, amount: 48500, status: 'Released', payment: 'Insurance' },
    { id: 'B-2002', patient: 'Amit Patel', type: 'OPD', date: '02/05/2026', items: 2, amount: 850, status: 'Completed', payment: 'Cash' },
  ];
};

export const saveBill = (bill: any) => {
  const bills = getBills();
  const updatedBills = [bill, ...bills];
  localStorage.setItem('hospital_bills', JSON.stringify(updatedBills));
  return updatedBills;
};

export const getPharmacySales = () => {
  const saved = localStorage.getItem('pharmacy_sales');
  if (saved) return JSON.parse(saved);
  
  return [
    { billNo: 'PH-4501', patient: 'Rajesh Kumar', date: '02 May 2026', time: '10:30 AM', items: 3, total: 454.00, discount: 0, payment: 'Cash', status: 'Completed' },
    { billNo: 'PH-4500', patient: 'Walk-in Patient', date: '01 May 2026', time: '04:15 PM', items: 2, total: 240.00, discount: 10, payment: 'UPI', status: 'Completed' },
  ];
};

export const savePharmacySale = (sale: any) => {
  const sales = getPharmacySales();
  const updatedSales = [sale, ...sales];
  localStorage.setItem('pharmacy_sales', JSON.stringify(updatedSales));
  return updatedSales;
};

import StatsGrid from '../components/StatsGrid';
import AppointmentsTrends from '../components/AppointmentsTrends';
import RoomOccupancy from '../components/RoomOccupancy';
import RecentAdmissions from '../components/RecentAdmissions';
import TaskList from '../components/TaskList';
import AppointmentsCalendar from '../components/AppointmentsCalendar';
import QuickActions from '../components/QuickActions';
import RoomStatus from '../components/RoomStatus';
import DarkModeToggle from '../components/DarkModeToggle';
import { useAuth } from '../AuthContext';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { onOpenMessages } = useOutletContext<{ onOpenMessages: () => void }>();

  const handleStatClick = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('message')) {
      onOpenMessages?.();
    } else if (t.includes('patient')) {
      navigate('/patients');
    } else if (t.includes('appointment')) {
      navigate('/appointments');
    } else if (t.includes('surgery')) {
      navigate('/ipd');
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 font-display">
            Hospital Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">
            Welcome back, <span className="text-brand-primary font-bold">{user?.name}</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <DarkModeToggle />
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-2xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            Download Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Top Stats */}
        <div className="col-span-12">
          <StatsGrid onCardClick={handleStatClick} />
        </div>

        {/* Middle Section */}
        <div className="col-span-12 lg:col-span-4">
          <AppointmentsTrends />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RoomOccupancy />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecentAdmissions />
        </div>

        {/* Bottom Section */}
        <div className="col-span-12 lg:col-span-3">
          <TaskList />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <AppointmentsCalendar />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-6">
            <QuickActions />
            <RoomStatus />
          </div>
        </div>
      </div>
    </div>
  );
}

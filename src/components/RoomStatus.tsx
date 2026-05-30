export default function RoomStatus() {
  const rooms = [
    { name: 'ICU', value: 2, total: 4, color: 'bg-brand-secondary' },
    { name: 'Ward A', value: 8, total: 10, color: 'bg-brand-accent-blue' },
    { name: 'Ward B', value: 5, total: 8, color: 'bg-brand-accent-green' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Room Status</h3>
      
      <div className="space-y-4">
        {rooms.map((room) => {
          const percentage = (room.value / room.total) * 100;
          return (
            <div key={room.name}>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">{room.name}</span>
                <span className="text-slate-500 font-mono">{room.value} / {room.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${room.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

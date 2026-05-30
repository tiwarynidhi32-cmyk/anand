export default function PlaceholderView({ name }: { name: string }) {
  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
        <span className="text-3xl">🏥</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{name} Module</h1>
      <p className="text-slate-500 max-w-md">This module is part of the comprehensive Eye Hospital Management system. It is currently being populated with data fields according to the specification.</p>
      
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

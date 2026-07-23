export default function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse mb-3" />
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg mb-2" />
          <div className="h-4 w-24 bg-slate-100 animate-pulse rounded-lg" />
        </div>
      ))}
    </div>
  )
}
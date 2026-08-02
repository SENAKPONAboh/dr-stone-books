export default function StatsGrid() {
  const stats = [
    { title: "Livres activés", value: "1", icon: "📚", color: "bg-amber-50 text-amber-600" },
    { title: "Cas disponibles", value: "40", icon: "📖", color: "bg-blue-50 text-blue-600" },
    { title: "Cas déjà réalisés", value: "8", icon: "✅", color: "bg-emerald-50 text-emerald-600" },
    { title: "Points gagnés", value: "325", icon: "⭐", color: "bg-purple-50 text-purple-600" },
    { title: "Classement actuel", value: "18e", icon: "🏆", color: "bg-rose-50 text-rose-600" },
    { title: "Grade actuel", value: "🥉 Bronze", icon: "🎖", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className={`p-2 rounded-lg text-lg ${stat.color}`}>{stat.icon}</span>
            <span className="text-xl font-extrabold text-gray-900">{stat.value}</span>
          </div>
          <span className="text-xs font-medium text-gray-500">{stat.title}</span>
        </div>
      ))}
    </div>
  );
}
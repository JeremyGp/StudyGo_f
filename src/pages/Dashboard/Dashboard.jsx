import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: "▣", path: "/dashboard" },
    { name: "Mi Agenda", icon: "◷", path: "/mi-agenda" },
    { name: "Mis Asignaturas", icon: "◫", path: "/mis-asignaturas" },
    { name: "Planes Académicos", icon: "▣", path: "/planes-academicos" },
    { name: "Progreso", icon: "◔", path: "/progreso" },
    { name: "Directorio", icon: "◍", path: "/directorio" },
    { name: "Horarios", icon: "◌", path: "/horarios" },
    { name: "Tutor IA", icon: "◎", path: "/tutor-ia" },
    { name: "Ajustes", icon: "⚙", path: "/ajustes" },
  ];

  const subjects = [
    {
      name: "Diseño UX",
      professor: "Dra. Camila Ortiz",
      progress: 78,
      color: "bg-cyan-500",
    },
    {
      name: "Programación React",
      professor: "Ing. Mateo Silva",
      progress: 92,
      color: "bg-emerald-500",
    },
    {
      name: "Bases de Datos",
      professor: "Lic. Mariana Vega",
      progress: 64,
      color: "bg-amber-500",
    },
    {
      name: "Análisis de Datos",
      professor: "Mtro. Nicolás Pérez",
      progress: 81,
      color: "bg-violet-500",
    },
  ];

  const deadlines = [
    {
      title: "Entrega de proyecto final",
      course: "Diseño UX",
      due: "Hoy · 18:00",
      priority: "Alta",
      priorityClass: "bg-rose-100 text-rose-600",
    },
    {
      title: "Prueba de React",
      course: "Programación",
      due: "Mañana · 09:30",
      priority: "Media",
      priorityClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Tarea de SQL",
      course: "Bases de Datos",
      due: "Jue · 14:00",
      priority: "Baja",
      priorityClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  const stats = [
    {
      label: "Promedio actual",
      value: "8.9/10",
      detail: "+0.4 este mes",
      accent: "from-cyan-500 to-blue-600",
    },
    {
      label: "Asistencia",
      value: "96%",
      detail: "Excelente",
      accent: "from-emerald-500 to-green-600",
    },
    {
      label: "Tareas entregadas",
      value: "24",
      detail: "8 pendientes",
      accent: "from-violet-500 to-fuchsia-600",
    },
  ];

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="flex w-full flex-shrink-0 flex-col rounded-b-[2rem] bg-slate-950 p-6 text-slate-200 shadow-2xl lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:rounded-r-[2rem] lg:rounded-b-none">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-semibold text-slate-950">
              S
            </div>
            <div>
              <p className="text-xl font-semibold text-white">StudyGo</p>
              <p className="text-sm text-slate-400">Plataforma educativa</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 font-semibold text-slate-950">
                {user?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {user?.nombre || "Usuario"}
                </p>
                <p className="text-sm text-slate-400">{user?.rol || "Estudiante"}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm font-semibold text-white">¿Listo para seguir?</p>
            <p className="mt-1 text-sm text-slate-400">
              Mantén tu progreso en movimiento.
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-slate-400">⌕</span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Buscar cursos, tareas o clases"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-600">
                🔔
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.nombre?.split(" ")[0] || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-semibold text-white">
                  {user?.nombre?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </div>
          </header>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-xl sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                      Bienvenido de nuevo
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">
                      Hola, {user?.nombre?.split(" ")[0] || "estudiante"} 👋
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-slate-300">
                      {today.charAt(0).toUpperCase() + today.slice(1)}
                    </p>
                  </div>
                  <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-300 sm:w-auto">
                    + Agregar curso o tarea
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-4 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Plan de estudio</p>
                    <h3 className="text-xl font-semibold text-slate-900">Asignaturas</h3>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
                    Ver todo
                  </button>
                </div>

                <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-[640px] w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Curso</th>
                        <th className="px-4 py-3">Profesor</th>
                        <th className="px-4 py-3">Progreso</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {subjects.map((subject) => (
                        <tr key={subject.name} className="text-sm">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">{subject.name}</p>
                            <p className="text-xs text-slate-500">Semestre actual</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{subject.professor}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 w-24 rounded-full bg-slate-100">
                                <div
                                  className={`h-2.5 rounded-full ${subject.color}`}
                                  style={{ width: `${subject.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {subject.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                Ver
                              </button>
                              <button className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                Editar
                              </button>
                              <button className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${stat.accent}`} />
                    <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Próximos vencimientos</p>
                    <h3 className="text-xl font-semibold text-slate-900">Tareas</h3>
                  </div>
                  <button className="rounded-full bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white">
                    + Crear
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {deadlines.map((task) => (
                    <div key={task.title} className="rounded-2xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">{task.title}</p>
                          <p className="text-sm text-slate-500">
                            {task.course} • {task.due}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.priorityClass}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Rendimiento</p>
                    <h3 className="text-xl font-semibold text-slate-900">Estatus Semestral</h3>
                  </div>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-orange-600">
                    84%
                  </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/70">
                  <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Estás a un paso de completar tu meta semestral.
                </p>
              </div>
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

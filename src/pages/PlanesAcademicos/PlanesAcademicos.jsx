import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function PlanesAcademicos() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "◫", path: "/dashboard" },
    { name: "Mi Agenda", icon: "◷", path: "/mi-agenda" },
    { name: "Mis Asignaturas", icon: "◫", path: "/mis-asignaturas" },
    { name: "Planes Académicos", icon: "▣", path: "/planes-academicos" },
    { name: "Progreso", icon: "◔", path: "/progreso" },
    { name: "Directorio", icon: "◍", path: "/directorio" },
    { name: "Horarios", icon: "◌", path: "/horarios" },
    { name: "Tutor IA", icon: "◎", path: "/tutor-ia" },
    { name: "Ajustes", icon: "⚙", path: "/ajustes" },
  ];

  const overviewCards = [
    { label: "Total de planes", value: "24", detail: "+3 esta semana" },
    { label: "Optimizados por IA", value: "12", detail: "50% del total" },
    { label: "En revisión", value: "5", detail: "2 pendientes" },
    { label: "Última actividad", value: "Hoy", detail: "08:45 AM" },
  ];

  const plans = [
    {
      name: "Plan de Ingeniería de Software",
      responsible: "Dr. Ana Morales",
      status: "Optimizado por IA",
      start: "10 Feb 2026",
      end: "30 Jun 2026",
      statusClass: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Ruta de formación en UX",
      responsible: "Mtra. Elena Ruiz",
      status: "En revisión",
      start: "18 Mar 2026",
      end: "14 Jul 2026",
      statusClass: "bg-amber-100 text-amber-700",
    },
    {
      name: "Estrategia de innovación docente",
      responsible: "Ing. Jorge León",
      status: "Creado",
      start: "02 Abr 2026",
      end: "20 Ago 2026",
      statusClass: "bg-sky-100 text-sky-700",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="flex w-full flex-shrink-0 flex-col bg-slate-950 p-6 text-slate-200 shadow-2xl lg:min-h-screen lg:w-72 lg:rounded-r-[2rem]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 font-semibold text-slate-950">
              S
            </div>
            <div>
              <p className="text-xl font-semibold text-white">StudyGo</p>
              <p className="text-sm text-slate-400">Plataforma educativa</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
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

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">Panel de gestión</p>
            <p className="mt-1 text-sm text-slate-400">
              Coordina planes, recursos y seguimiento académico.
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
            <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-slate-400">⌕</span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Buscar planes, responsables o estado"
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
                  <p className="text-xs text-slate-500">Coordinador</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-semibold text-white">
                  {user?.nombre?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </div>
          </header>

            <section className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  Gestión académica
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                  Mis Planes Académicos
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Revisa, organiza y ajusta tus planes académicos con una vista centralizada y clara.
                </p>
              </div>
              <button className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-600">
                + Crear nuevo plan
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => (
                <div key={card.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  <select className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
                    <option>Todos los estados</option>
                    <option>Optimizado por IA</option>
                    <option>En revisión</option>
                    <option>Creado</option>
                  </select>
                  <select className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
                    <option>Todos los responsables</option>
                    <option>Dr. Ana Morales</option>
                    <option>Mtra. Elena Ruiz</option>
                    <option>Ing. Jorge León</option>
                  </select>
                  <select className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
                    <option>Últimos 6 meses</option>
                    <option>Este año</option>
                    <option>2025</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-slate-200">
                <table className="min-w-[720px] w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Responsable</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Inicio</th>
                      <th className="px-4 py-3">Fin</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {plans.map((plan) => (
                      <tr key={plan.name} className="text-sm">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{plan.name}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{plan.responsible}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${plan.statusClass}`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{plan.start}</td>
                        <td className="px-4 py-3 text-slate-600">{plan.end}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
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

              <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <p>Mostrando 3 de 24 planes académicos.</p>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600">
                    ← Anterior
                  </button>
                  <button className="rounded-full bg-cyan-500 px-3 py-1.5 font-semibold text-white">
                    1
                  </button>
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600">
                    2
                  </button>
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600">
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PlanesAcademicos;

import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function PanelShell({ title, subtitle, actionLabel, onAction, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

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
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-cyan-500 text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">Panel de gestión</p>
            <p className="mt-1 text-sm text-slate-400">
              Gestiona tu aprendizaje, tareas y progreso académico.
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
                placeholder="Buscar contenido o recursos"
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
            {(title || subtitle || actionLabel) && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  {title && (
                    <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
                  )}
                  {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
                </div>
                {actionLabel && (
                  <button
                    onClick={onAction}
                    className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-600"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            )}

            <div className="mt-6">{children}</div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PanelShell;

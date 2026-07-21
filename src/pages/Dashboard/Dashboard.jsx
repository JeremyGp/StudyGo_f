import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Modal from "../../components/ui/Modal";
import { useAuth } from "../../hooks/useAuth";
import { asignaturaService } from "../../services/asignatura";
import { dashboardService } from "../../services/dashboard";
import { tareaService } from "../../services/tarea";

const INITIAL_SUMMARY = {
  total_tareas: 0,
  tareas_pendientes: 0,
  tareas_en_proceso: 0,
  tareas_completadas: 0,
  tareas_vencidas: 0,
  proximas_entregas: [],
};

const priorityStyles = {
  Alta: "bg-rose-100 text-rose-600",
  Media: "bg-amber-100 text-amber-600",
  Baja: "bg-emerald-100 text-emerald-600",
};

const getApiError = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback;

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [subjects, setSubjects] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboardData, subjectData] = await Promise.all([
        dashboardService.obtenerResumen(),
        asignaturaService.listar(),
      ]);

      const taskGroups = await Promise.all(
        subjectData.map((subject) => tareaService.listar(subject.id_asignatura))
      );
      const progress = {};
      subjectData.forEach((subject, index) => {
        const tasks = taskGroups[index];
        const completed = tasks.filter(
          (task) => String(task.estado).toLowerCase() === "completada"
        ).length;
        progress[subject.id_asignatura] = tasks.length
          ? Math.round((completed / tasks.length) * 100)
          : 0;
      });

      setSummary(dashboardData);
      setSubjects(subjectData);
      setSubjectProgress(progress);
    } catch (requestError) {
      setError(getApiError(requestError, "No fue posible cargar el dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const completionRate = useMemo(
    () =>
      summary.total_tareas
        ? Math.round((summary.tareas_completadas / summary.total_tareas) * 100)
        : 0,
    [summary]
  );

  const stats = [
    { label: "Total de tareas", value: summary.total_tareas, detail: `${summary.tareas_pendientes} pendientes`, accent: "from-cyan-500 to-blue-600" },
    { label: "Completadas", value: summary.tareas_completadas, detail: `${completionRate}% de progreso`, accent: "from-emerald-500 to-green-600" },
    { label: "En proceso", value: summary.tareas_en_proceso, detail: `${summary.tareas_vencidas} vencidas`, accent: "from-violet-500 to-fuchsia-600" },
  ];

  const menuItems = [
    { name: "Dashboard", icon: "▣", path: "/dashboard" },
    { name: "Mi Agenda", icon: "◷", path: "/mi-agenda" },
    { name: "Mis Asignaturas", icon: "◫", path: "/mis-asignaturas" },
    { name: "Horarios", icon: "◌", path: "/horarios" },
    { name: "Ajustes", icon: "⚙", path: "/ajustes" },
  ];

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const openModal = (type, data = null) => {
    setError("");
    setModalContent({ type, data });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const runAction = async (action) => {
    setActionLoading(true);
    setError("");
    try {
      await action();
      closeModal();
      await loadDashboard();
    } catch (actionError) {
      setError(getApiError(actionError, "No fue posible completar la operación."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubject = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction(() =>
      asignaturaService.crear({
        nombre: form.get("nombre").trim(),
        descripcion: form.get("descripcion").trim() || null,
        ciclo: form.get("ciclo").trim(),
        docente: form.get("docente").trim(),
      })
    );
  };

  const handleEditSubject = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction(() =>
      asignaturaService.actualizar(modalContent.data.id_asignatura, {
        nombre: form.get("nombre").trim(),
        descripcion: form.get("descripcion").trim() || null,
        ciclo: form.get("ciclo").trim(),
        docente: form.get("docente").trim(),
      })
    );
  };

  const handleCreateTask = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction(() =>
      tareaService.crear(Number(form.get("id_asignatura")), {
        titulo: form.get("titulo").trim(),
        descripcion: form.get("descripcion").trim() || null,
        fecha_inicio: form.get("fecha_inicio"),
        fecha_limite: form.get("fecha_limite"),
        prioridad: form.get("prioridad"),
        horas_estimadas: Number(form.get("horas_estimadas")),
      })
    );
  };

  const modalTitle = {
    seleccionar: "¿Qué deseas agregar?",
    crearAsignatura: "Nueva asignatura",
    crearTarea: "Nueva tarea",
    ver: "Detalle de asignatura",
    editar: "Editar asignatura",
    eliminar: "Eliminar asignatura",
  }[modalContent?.type];

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-800">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="flex w-full flex-shrink-0 flex-col rounded-b-[2rem] bg-slate-950 p-6 text-slate-200 shadow-2xl lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:rounded-b-none lg:rounded-r-[2rem]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-semibold text-slate-950">S</div>
              <div><p className="text-xl font-semibold text-white">StudyGo</p><p className="text-sm text-slate-400">Plataforma educativa</p></div>
            </div>
            <nav className="mt-8 space-y-1">
              {menuItems.map((item) => (
                <button key={item.name} onClick={() => navigate(item.path)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${location.pathname === item.path ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </button>
              ))}
            </nav>
            <button onClick={() => { logout(); navigate("/"); }} className="mt-auto rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">Cerrar sesión</button>
          </aside>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
              <header className="flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
                <div><p className="text-sm text-slate-500">Sesión activa</p><p className="font-semibold">{user?.correo}</p></div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-semibold text-white">{user?.nombre?.charAt(0).toUpperCase() || "U"}</div>
              </header>

              {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

              <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
                <div className="space-y-6">
                  <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div><p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Bienvenido de nuevo</p><h2 className="mt-2 text-3xl font-semibold">Hola, {user?.nombre?.split(" ")[0] || "estudiante"} 👋</h2><p className="mt-2 text-sm text-slate-300">{today.charAt(0).toUpperCase() + today.slice(1)}</p></div>
                      <button onClick={() => openModal("seleccionar")} className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300">+ Agregar</button>
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">Plan de estudio</p><h3 className="text-xl font-semibold text-slate-900">Asignaturas</h3></div><span className="text-sm text-slate-500">{subjects.length} registradas</span></div>
                    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full min-w-[640px] divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Asignatura</th><th className="px-4 py-3">Docente</th><th className="px-4 py-3">Progreso</th><th className="px-4 py-3">Acciones</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {subjects.map((subject) => {
                            const progress = subjectProgress[subject.id_asignatura] || 0;
                            return <tr key={subject.id_asignatura} className="text-sm"><td className="px-4 py-3"><p className="font-semibold">{subject.nombre}</p><p className="text-xs text-slate-500">{subject.ciclo}</p></td><td className="px-4 py-3 text-slate-600">{subject.docente}</td><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-2.5 w-24 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-cyan-500" style={{ width: `${progress}%` }} /></div><span className="font-semibold">{progress}%</span></div></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openModal("ver", subject)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">Ver</button><button onClick={() => openModal("editar", subject)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">Editar</button><button onClick={() => openModal("eliminar", subject)} className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">Eliminar</button></div></td></tr>;
                          })}
                          {!loading && subjects.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">Aún no tienes asignaturas registradas.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => <div key={stat.label} className="rounded-[1.5rem] bg-white p-4 shadow-sm"><div className={`h-1.5 rounded-full bg-gradient-to-r ${stat.accent}`} /><p className="mt-4 text-sm text-slate-500">{stat.label}</p><p className="mt-1 text-2xl font-semibold">{loading ? "—" : stat.value}</p><p className="mt-1 text-sm text-slate-500">{stat.detail}</p></div>)}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[2rem] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">Próximos 7 días</p><h3 className="text-xl font-semibold">Entregas</h3></div><button onClick={() => openModal("crearTarea")} disabled={!subjects.length} className="rounded-full bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50">+ Crear</button></div>
                    <div className="mt-4 space-y-3">
                      {summary.proximas_entregas.map((task) => <div key={task.id_tarea} className="rounded-2xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{task.titulo}</p><p className="text-sm text-slate-500">{task.asignatura} • {formatDate(task.fecha_limite)}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.prioridad] || "bg-slate-100 text-slate-600"}`}>{task.prioridad}</span></div></div>)}
                      {!loading && summary.proximas_entregas.length === 0 && <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">No hay entregas próximas.</p>}
                    </div>
                  </div>
                  <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">Progreso</p><h3 className="text-xl font-semibold">Tareas completadas</h3></div><span className="rounded-full bg-white/80 px-3 py-1 font-semibold text-orange-600">{completionRate}%</span></div><div className="mt-4 h-3 rounded-full bg-white/70"><div className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${completionRate}%` }} /></div><p className="mt-3 text-sm text-slate-600">{summary.tareas_vencidas ? `Tienes ${summary.tareas_vencidas} tarea(s) vencida(s).` : "No tienes tareas vencidas."}</p></div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle || "Acción"}>
        {modalContent?.type === "seleccionar" && <div className="space-y-3"><button onClick={() => openModal("crearAsignatura")} className="w-full rounded-xl border p-4 text-left hover:border-cyan-500"><strong>Nueva asignatura</strong><p className="text-sm text-slate-500">Añade una materia al ciclo actual.</p></button><button onClick={() => openModal("crearTarea")} disabled={!subjects.length} className="w-full rounded-xl border p-4 text-left hover:border-amber-500 disabled:opacity-50"><strong>Nueva tarea</strong><p className="text-sm text-slate-500">Programa una entrega en una asignatura.</p></button></div>}
        {modalContent?.type === "crearAsignatura" && <SubjectForm onSubmit={handleCreateSubject} loading={actionLoading} />}
        {modalContent?.type === "editar" && <SubjectForm subject={modalContent.data} onSubmit={handleEditSubject} loading={actionLoading} />}
        {modalContent?.type === "crearTarea" && <TaskForm subjects={subjects} onSubmit={handleCreateTask} loading={actionLoading} />}
        {modalContent?.type === "ver" && <div className="space-y-3"><Detail label="Asignatura" value={modalContent.data.nombre} /><Detail label="Docente" value={modalContent.data.docente} /><Detail label="Ciclo" value={modalContent.data.ciclo} /><Detail label="Descripción" value={modalContent.data.descripcion || "Sin descripción"} /></div>}
        {modalContent?.type === "eliminar" && <div className="space-y-4 text-center"><p>¿Deseas eliminar <strong>{modalContent.data.nombre}</strong>?</p><p className="text-sm text-slate-500">La operación puede afectar sus tareas y horarios asociados.</p><div className="flex gap-3"><button onClick={closeModal} className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5">Cancelar</button><button disabled={actionLoading} onClick={() => runAction(() => asignaturaService.eliminar(modalContent.data.id_asignatura))} className="flex-1 rounded-lg bg-rose-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50">Eliminar</button></div></div>}
      </Modal>
    </>
  );
}

function SubjectForm({ subject, onSubmit, loading }) {
  return <form onSubmit={onSubmit} className="space-y-4"><Field label="Nombre" name="nombre" defaultValue={subject?.nombre} required /><Field label="Docente" name="docente" defaultValue={subject?.docente} required /><Field label="Ciclo" name="ciclo" defaultValue={subject?.ciclo} placeholder="2026-2" required /><Field label="Descripción" name="descripcion" defaultValue={subject?.descripcion} /><button disabled={loading} className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{loading ? "Guardando..." : "Guardar asignatura"}</button></form>;
}

function TaskForm({ subjects, onSubmit, loading }) {
  return <form onSubmit={onSubmit} className="space-y-4"><Field label="Título" name="titulo" required /><Field label="Descripción" name="descripcion" /><label className="block text-sm font-medium">Asignatura<select name="id_asignatura" required className="mt-1 w-full rounded-lg border border-slate-300 p-2.5">{subjects.map((subject) => <option key={subject.id_asignatura} value={subject.id_asignatura}>{subject.nombre}</option>)}</select></label><Field label="Fecha de inicio" name="fecha_inicio" type="datetime-local" required /><Field label="Fecha límite" name="fecha_limite" type="datetime-local" required /><label className="block text-sm font-medium">Prioridad<select name="prioridad" className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"><option>Media</option><option>Alta</option><option>Baja</option></select></label><Field label="Horas estimadas" name="horas_estimadas" type="number" min="1" required /><button disabled={loading} className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{loading ? "Guardando..." : "Guardar tarea"}</button></form>;
}

function Field({ label, ...props }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input {...props} className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500" /></label>;
}

function Detail({ label, value }) {
  return <div className="rounded-xl border bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">{label}</p><p className="font-semibold text-slate-900">{value}</p></div>;
}

export default Dashboard;

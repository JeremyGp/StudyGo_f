import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // --- NUEVA FUNCIÓN PARA COLORES DINÁMICOS ---
  const getProgressStyles = (progressValue) => {
    const value = parseInt(progressValue) || 0;
    if (value <= 30) return { bg: "bg-rose-500", text: "text-rose-600" };
    if (value <= 60) return { bg: "bg-amber-500", text: "text-amber-600" };
    if (value <= 85) return { bg: "bg-cyan-500", text: "text-cyan-600" };
    return { bg: "bg-emerald-500", text: "text-emerald-600" };
  };

  // 1. Datos por defecto
  const defaultSubjects = [
    { name: "Diseño UX", professor: "Dra. Camila Ortiz", progress: 78 },
    { name: "Programación React", professor: "Ing. Mateo Silva", progress: 92 },
    { name: "Bases de Datos", professor: "Lic. Mariana Vega", progress: 64 },
    { name: "Análisis de Datos", professor: "Mtro. Nicolás Pérez", progress: 81 },
  ];

  const defaultDeadlines = [
    { title: "Entrega de proyecto final", course: "Diseño UX", due: "Hoy · 18:00", priority: "Alta", priorityClass: "bg-rose-100 text-rose-600" },
    { title: "Prueba de React", course: "Programación", due: "Mañana · 09:30", priority: "Media", priorityClass: "bg-amber-100 text-amber-600" },
    { title: "Tarea de SQL", course: "Bases de Datos", due: "Jue · 14:00", priority: "Baja", priorityClass: "bg-emerald-100 text-emerald-600" },
  ];

  // 2. LocalStorage
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("studygo_subjects");
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [deadlines, setDeadlines] = useState(() => {
    const saved = localStorage.getItem("studygo_deadlines");
    return saved ? JSON.parse(saved) : defaultDeadlines;
  });

  useEffect(() => {
    localStorage.setItem("studygo_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("studygo_deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenModal = (type, data = null) => {
    setModalContent({ type, data });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalContent(null), 200);
  };

  // --- HANDLERS DE FORMULARIOS ---
  const handleCreateTask = (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const course = e.target.elements.course.value;
    
    if (!title || !course) return;

    const newTask = {
      title,
      course,
      due: "Próximamente", 
      priority: "Media",
      priorityClass: "bg-amber-100 text-amber-600",
    };

    setDeadlines([...deadlines, newTask]);
    handleCloseModal();
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const professor = e.target.elements.professor.value;
    
    if (!name || !professor) return;

    const newSubject = {
      name,
      professor,
      progress: 0, // Inicia en 0%
    };

    setSubjects([...subjects, newSubject]);
    handleCloseModal();
  };

  const handleEditSubject = (e) => {
    e.preventDefault();
    const newName = e.target.elements.name.value;
    const newProfessor = e.target.elements.professor.value;

    const updatedSubjects = subjects.map(sub => 
      sub.name === modalContent.data.name 
        ? { ...sub, name: newName, professor: newProfessor } 
        : sub
    );
    
    setSubjects(updatedSubjects);
    handleCloseModal();
  };

  const handleDeleteSubject = () => {
    const updatedSubjects = subjects.filter(sub => sub.name !== modalContent.data.name);
    setSubjects(updatedSubjects);
    handleCloseModal();
  };

  // Títulos limpios para el Modal
  const getModalTitle = (type) => {
    switch(type) {
      case 'seleccionarOpcion': return '¿Qué deseas agregar?';
      case 'crearTarea': return 'Crear Nueva Tarea';
      case 'crearCurso': return 'Agregar Nueva Asignatura';
      case 'ver': return 'Detalles del Curso';
      case 'editar': return 'Editar Asignatura';
      case 'eliminar': return 'Eliminar Asignatura';
      default: return 'Acción';
    }
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

  const stats = [
    { label: "Promedio actual", value: "8.9/10", detail: "+0.4 este mes", accent: "from-cyan-500 to-blue-600" },
    { label: "Asistencia", value: "96%", detail: "Excelente", accent: "from-emerald-500 to-green-600" },
    { label: "Tareas entregadas", value: "24", detail: "8 pendientes", accent: "from-violet-500 to-fuchsia-600" },
  ];

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-800">
        <div className="flex min-h-screen flex-col lg:flex-row">
          
          {/* SIDEBAR */}
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
              <p className="mt-1 text-sm text-slate-400">Mantén tu progreso en movimiento.</p>
              <button
                onClick={handleLogout}
                className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
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
                  {/* HERO SECTION */}
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
                      <button 
                        onClick={() => handleOpenModal("seleccionarOpcion")}
                        className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-300 sm:w-auto">
                        + Agregar curso o tarea
                      </button>
                    </div>
                  </div>

                  {/* TABLA ASIGNATURAS */}
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
                          {subjects.map((subject) => {
                            const dynamicColor = getProgressStyles(subject.progress);
                            
                            return (
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
                                        className={`h-2.5 rounded-full ${dynamicColor.bg}`}
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
                                    <button onClick={() => handleOpenModal("ver", subject)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">Ver</button>
                                    <button onClick={() => handleOpenModal("editar", subject)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">Editar</button>
                                    <button onClick={() => handleOpenModal("eliminar", subject)} className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-200">Eliminar</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* STATS */}
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

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">
                  {/* TAREAS */}
                  <div className="rounded-[2rem] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Próximos vencimientos</p>
                        <h3 className="text-xl font-semibold text-slate-900">Tareas</h3>
                      </div>
                      <button 
                        onClick={() => handleOpenModal("crearTarea")}
                        className="rounded-full bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-600">
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

      {/* --- RENDERIZADO DEL MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={getModalTitle(modalContent?.type)}
      >
        {/* 1. ESTADO DE SELECCIÓN */}
        {modalContent?.type === "seleccionarOpcion" && (
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-slate-500 text-sm mb-2">Elige qué elemento deseas incorporar a tu plataforma.</p>
            <button
              onClick={() => handleOpenModal("crearCurso")}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-cyan-500 hover:bg-cyan-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-xl text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                  ◫
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Nueva Asignatura</p>
                  <p className="text-xs text-slate-500">Agrega un curso a tu semestre actual</p>
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-cyan-500">→</span>
            </button>
            <button
              onClick={() => handleOpenModal("crearTarea")}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-amber-500 hover:bg-amber-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                  📋
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Nueva Tarea</p>
                  <p className="text-xs text-slate-500">Programa un trabajo o examen</p>
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-amber-500">→</span>
            </button>
          </div>
        )}

        {/* 2. CREAR CURSO */}
        {modalContent?.type === "crearCurso" && (
          <form onSubmit={handleCreateSubject} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Nombre de la Asignatura</label>
              <input type="text" name="name" placeholder="Ej: Álgebra Lineal" className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Profesor asignado</label>
              <input type="text" name="professor" placeholder="Ej: Dra. Elena Montes" className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" required />
            </div>
            <button type="submit" className="w-full bg-cyan-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-cyan-600 transition mt-2">
              Guardar Asignatura
            </button>
          </form>
        )}

        {/* 3. CREAR TAREA */}
        {modalContent?.type === "crearTarea" && (
          <form onSubmit={handleCreateTask} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Título de la tarea</label>
              <input type="text" name="title" placeholder="Ej: Proyecto Final React" className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Curso correspondiente</label>
              <input type="text" name="course" placeholder="Ej: Programación" className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Fecha límite</label>
              <input type="datetime-local" name="due" className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
            </div>
            <button type="submit" className="w-full bg-cyan-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-cyan-600 transition mt-2">
              Guardar Tarea
            </button>
          </form>
        )}

        {/* 4. VER, EDITAR, ELIMINAR CURSOS */}
        {modalContent?.type === "ver" && (
          <div className="space-y-3 text-slate-700 mt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Asignatura</p>
              <p className="font-semibold text-lg text-slate-900">{modalContent.data.name}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Catedrático</p>
              <p className="font-semibold text-slate-900">{modalContent.data.professor}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Progreso Actual</p>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getProgressStyles(modalContent.data.progress).bg}`}>
                {modalContent.data.progress}%
              </span>
            </div>
          </div>
        )}

        {modalContent?.type === "editar" && (
          <form onSubmit={handleEditSubject} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Nombre del Curso</label>
              <input type="text" name="name" defaultValue={modalContent.data.name} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Profesor</label>
              <input type="text" name="professor" defaultValue={modalContent.data.professor} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-cyan-500" required />
            </div>
            <button type="submit" className="w-full bg-cyan-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-cyan-600 transition mt-2">
              Actualizar Asignatura
            </button>
          </form>
        )}

        {modalContent?.type === "eliminar" && (
          <div className="space-y-4 mt-2 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              !
            </div>
            <p className="text-slate-700">¿Estás completamente seguro de que deseas eliminar <strong>{modalContent.data.name}</strong>?</p>
            <p className="text-sm text-slate-500">Esta acción removerá el curso de tu plan de estudios y no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCloseModal} className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition">
                Cancelar
              </button>
              <button onClick={handleDeleteSubject} className="flex-1 bg-rose-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-rose-600 transition">
                Sí, eliminar
              </button>
            </div>
          </div>
        )}

      </Modal>
    </>
  );
}

export default Dashboard;
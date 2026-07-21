import React, { useState, useEffect } from "react";
import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal";

function MiAgenda() {
  // 1. Estado sincronizado estrictamente con LocalStorage (inicia vacío si no hay datos)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("studygo_agenda");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Estados para la interfaz (Filtros, Pestañas y Modal)
  const [activeTab, setActiveTab] = useState("Próximos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Efecto para guardar en LocalStorage cada vez que cambien las tareas
  useEffect(() => {
    localStorage.setItem("studygo_agenda", JSON.stringify(tasks));
  }, [tasks]);

  // --- LÓGICA DE DATOS ---

  // Estadísticas para las tarjetas superiores
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const countAlta = tasks.filter((t) => t.priority === "Alta").length;
  const countMedia = tasks.filter((t) => t.priority === "Media").length;
  const countBaja = tasks.filter((t) => t.priority === "Baja").length;

  // Filtrado de tareas para la lista
  const filteredTasks = tasks.filter((task) => {
    // Filtro por pestaña
    if (activeTab === "Completados" && !task.completed) return false;
    if (activeTab === "Próximos" && task.completed) return false;
    // Filtro por prioridad
    if (priorityFilter !== "Todas" && task.priority !== priorityFilter) return false;
    
    return true;
  });

  // --- FUNCIONES DE ACCIÓN ---

  // Alternar el estado de completado de una tarea
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Guardar una nueva tarea desde el modal
  const handleSaveTask = (e) => {
    e.preventDefault();
    const form = e.target;
    
    const newTask = {
      id: Date.now(), // ID único basado en el tiempo
      title: form.title.value,
      priority: form.priority.value,
      category: form.category.value,
      date: form.date.value,
      time: form.time.value,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  // --- UTILIDADES VISUALES ---
  const getPriorityColors = (priority) => {
    if (priority === "Alta") return "bg-rose-50 text-rose-600";
    if (priority === "Media") return "bg-amber-50 text-amber-600";
    if (priority === "Baja") return "bg-blue-50 text-blue-600";
    return "bg-slate-100 text-slate-500";
  };

  return (
    <PanelShell
      title="Mi Agenda"
      subtitle="Organiza tus hitos académicos y mantén el ritmo de estudio."
    >
      
      {/* Botón Nueva Tarea superior (Alineado a la derecha en pantallas grandes) */}
      <div className="absolute top-6 right-6 hidden sm:block">
         <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            + Nueva Tarea
          </button>
      </div>

      {/* Solo visible en móviles */}
      <div className="mb-6 sm:hidden">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
        >
          + Nueva Tarea
        </button>
      </div>

      {/* --- SECCIÓN SUPERIOR: DASHBOARD DE ESTADÍSTICAS --- */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        
        {/* Tarjeta: Filtrar por Prioridad */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrar por prioridad</p>
          <div className="grid grid-cols-4 gap-3">
            
            <div 
              onClick={() => setPriorityFilter("Alta")}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border ${priorityFilter === "Alta" ? "border-rose-400 bg-rose-50 shadow-sm" : "border-slate-100 hover:border-slate-300"} p-3 transition-all`}
            >
              <span className="text-2xl font-bold text-rose-500">{countAlta < 10 ? `0${countAlta}` : countAlta}</span>
              <span className="text-xs font-medium text-rose-400">Alta</span>
            </div>

            <div 
              onClick={() => setPriorityFilter("Media")}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border ${priorityFilter === "Media" ? "border-amber-400 bg-amber-50 shadow-sm" : "border-slate-100 hover:border-slate-300"} p-3 transition-all`}
            >
              <span className="text-2xl font-bold text-amber-500">{countMedia < 10 ? `0${countMedia}` : countMedia}</span>
              <span className="text-xs font-medium text-amber-400">Media</span>
            </div>

            <div 
              onClick={() => setPriorityFilter("Baja")}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border ${priorityFilter === "Baja" ? "border-blue-400 bg-blue-50 shadow-sm" : "border-slate-100 hover:border-slate-300"} p-3 transition-all`}
            >
              <span className="text-2xl font-bold text-blue-500">{countBaja < 10 ? `0${countBaja}` : countBaja}</span>
              <span className="text-xs font-medium text-blue-400">Baja</span>
            </div>

            <div 
              onClick={() => setPriorityFilter("Todas")}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border ${priorityFilter === "Todas" ? "border-slate-400 bg-slate-50 shadow-sm" : "border-slate-100 hover:border-slate-300"} p-3 transition-all`}
            >
              <span className="text-2xl font-bold text-slate-700">{totalTasks < 10 ? `0${totalTasks}` : totalTasks}</span>
              <span className="text-xs font-medium text-slate-500">Todas</span>
            </div>

          </div>
        </div>

        {/* Tarjeta: Progreso Semanal */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 text-white shadow-md lg:w-72">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Progreso Semanal</p>
          <p className="mt-2 text-5xl font-bold">{progressPercent}%</p>
          <p className="mt-2 text-sm text-slate-300">
            {completedTasks} de {totalTasks} tareas completadas esta semana.
          </p>
          <div className="absolute -bottom-4 -right-2 flex items-end gap-1 opacity-20">
            <div className="h-12 w-4 rounded-t-sm bg-white"></div>
            <div className="h-20 w-4 rounded-t-sm bg-white"></div>
            <div className="h-16 w-4 rounded-t-sm bg-white"></div>
            <div className="h-24 w-4 rounded-t-sm bg-white"></div>
            <div className="h-32 w-4 rounded-t-sm bg-white"></div>
          </div>
        </div>

      </div>

      {/* --- SECCIÓN INFERIOR: LISTA DE TAREAS --- */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        
        {/* Cabecera de la lista */}
        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-6">
            {["Próximos", "Hoy", "Completados"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex items-center text-sm text-slate-500 sm:mt-0">
            <span className="mr-2">≡</span> Ordenar por: <span className="ml-1 font-semibold text-slate-800 cursor-pointer">Fecha</span>
          </div>
        </div>

        {/* Lista de Items */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex flex-col p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                
                <div className="flex items-start gap-4 sm:w-1/2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <h4 className={`text-base font-bold ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {task.title}
                    </h4>
                    <div className="mt-1.5 flex items-center gap-3">
                      {task.priority && task.priority !== "Ninguna" && (
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityColors(task.priority)}`}>
                          Prioridad {task.priority}
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <span className="text-slate-400">📖</span> {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 sm:mt-0 sm:w-1/4">
                  {task.date && (
                    <>
                      <div className="text-rose-400 text-lg">📅</div>
                      <div>
                        <p className={`text-sm font-bold ${task.completed ? "text-slate-400" : "text-slate-800"}`}>{task.date}</p>
                        <p className="text-xs font-medium text-slate-500">{task.time}</p>
                      </div>
                    </>
                  )}
                  {task.completed && !task.date && (
                     <p className="text-sm font-medium italic text-slate-400">{task.category}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-2xl">
                📝
              </div>
              <p className="text-slate-500">Aún no hay tareas registradas aquí.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Crear tu primera tarea
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL PARA NUEVA TAREA --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Tarea"
      >
        <form onSubmit={handleSaveTask} className="mt-2 space-y-4">
          
          <div>
            <label className="text-sm font-medium text-slate-700">Título de la tarea</label>
            <input 
              type="text" 
              name="title" 
              placeholder="Ej: Ensayo de Historia" 
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Prioridad</label>
              <select 
                name="priority" 
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Categoría / Curso</label>
              <input 
                type="text" 
                name="category" 
                placeholder="Ej: Humanidades" 
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Fecha</label>
              <input 
                type="text" 
                name="date" 
                placeholder="Ej: 15 Nov, 2023" 
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Hora / Detalle</label>
              <input 
                type="text" 
                name="time" 
                placeholder="Ej: 10:00 AM - Aula 2" 
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
          >
            Guardar Tarea
          </button>
        </form>
      </Modal>

    </PanelShell>
  );
}

export default MiAgenda;
import React, { useState, useEffect } from "react";
import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal";

function MisAsignaturas() {
  // --- NUEVA FUNCIÓN PARA COLORES DINÁMICOS ---
  const getProgressStyles = (progressValue) => {
    const value = parseInt(progressValue) || 0;
    if (value <= 30) return { bg: "bg-rose-500", accent: "accent-rose-500", text: "text-rose-600" };
    if (value <= 60) return { bg: "bg-amber-500", accent: "accent-amber-500", text: "text-amber-600" };
    if (value <= 85) return { bg: "bg-cyan-500", accent: "accent-cyan-500", text: "text-cyan-600" };
    return { bg: "bg-emerald-500", accent: "accent-emerald-500", text: "text-emerald-600" };
  };

  // 1. Estado sincronizado con LocalStorage
  const [asignaturas, setAsignaturas] = useState(() => {
    const saved = localStorage.getItem("studygo_subjects");
    return saved ? JSON.parse(saved) : [
      { name: "Diseño UX", teacher: "Dra. Camila Ortiz", progress: "78%" },
      { name: "Programación React", teacher: "Ing. Mateo Silva", progress: "92%" },
      { name: "Bases de Datos", teacher: "Lic. Mariana Vega", progress: "64%" },
    ];
  });

  // 2. Estados para el Modal, Edición y Buscador
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null); // null = crear, objeto = editar
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Efecto para guardar cambios automáticamente
  useEffect(() => {
    localStorage.setItem("studygo_subjects", JSON.stringify(asignaturas));
  }, [asignaturas]);

  // 4. Función para guardar (Crear o Editar)
  const handleSaveSubject = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const teacher = e.target.elements.teacher.value;
    
    if (!name || !teacher) return;

    if (editingSubject) {
      // Modo Edición: Actualizar el existente
      const updatedAsignaturas = asignaturas.map(sub => 
        sub.name === editingSubject.name ? { ...sub, name, teacher } : sub
      );
      setAsignaturas(updatedAsignaturas);
    } else {
      // Modo Creación: Agregar nuevo
      const newSubject = { name, teacher, progress: "0%" };
      setAsignaturas([...asignaturas, newSubject]);
    }

    setIsModalOpen(false);
    setEditingSubject(null);
  };

  // 5. Función para actualizar el progreso con la barrita
  const handleProgressChange = (subjectName, newProgress) => {
    const updatedAsignaturas = asignaturas.map(sub => 
      sub.name === subjectName ? { ...sub, progress: `${newProgress}%` } : sub
    );
    setAsignaturas(updatedAsignaturas);
  };

  // 6. Preparar modales
  const openCreateModal = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  // 7. Filtrar resultados del buscador
  const filteredAsignaturas = asignaturas.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PanelShell
      title="Mis Asignaturas"
      subtitle="Administra tus cursos y revisa el estado de cada asignatura en tiempo real."
    >
      {/* Controles superiores: Buscador y Botón Agregar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Buscador */}
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:max-w-sm focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <span className="text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por curso o docente..." 
            className="w-full bg-transparent text-sm outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botón */}
        <button 
          onClick={openCreateModal}
          className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-600 hover:shadow-lg whitespace-nowrap"
        >
          + Agregar Asignatura
        </button>
      </div>

      {/* Grid de tarjetas filtradas */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAsignaturas.length > 0 ? (
          filteredAsignaturas.map((item) => {
            const dynamicStyles = getProgressStyles(item.progress); // <-- Calculamos colores aquí

            return (
              <div key={item.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:shadow-md">
                
                {/* Cabecera de la tarjeta con botón Editar */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-bold text-cyan-700 leading-tight">{item.name}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{item.teacher}</p>
                  </div>
                  <button 
                    onClick={() => openEditModal(item)}
                    className="rounded-full bg-white border border-slate-200 p-2 text-xs text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 transition"
                    title="Editar detalles"
                  >
                    ✏️
                  </button>
                </div>
                
                {/* Sección de Progreso Interactiva */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Progreso actual</span>
                    <span className={`text-sm font-bold ${dynamicStyles.text}`}>{item.progress}</span>
                  </div>
                  
                  {/* Input Range (Slider) con acento dinámico */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(item.progress) || 0}
                    onChange={(e) => handleProgressChange(item.name, e.target.value)}
                    className={`w-full h-2 appearance-none cursor-pointer rounded-full bg-slate-200 focus:outline-none ${dynamicStyles.accent}`}
                  />
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center text-slate-500">
            No se encontraron asignaturas que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      {/* Modal Dinámico (Crear / Editar) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? "Editar Asignatura" : "Agregar Nueva Asignatura"}
      >
        <form onSubmit={handleSaveSubject} className="mt-2 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Nombre de la Asignatura</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={editingSubject ? editingSubject.name : ""}
              placeholder="Ej: Álgebra Lineal" 
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Docente</label>
            <input 
              type="text" 
              name="teacher" 
              defaultValue={editingSubject ? editingSubject.teacher : ""}
              placeholder="Ej: Dra. Elena Montes" 
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-600"
          >
            {editingSubject ? "Guardar Cambios" : "Guardar Asignatura"}
          </button>
        </form>
      </Modal>

    </PanelShell>
  );
}

export default MisAsignaturas;
import React, { useState, useEffect } from "react";
import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal"; // Ajusta la ruta si es necesario según tu estructura

function MisAsignaturas() {
  // 1. Estado sincronizado con LocalStorage (para poder compartir data con el Dashboard si se requiere)
  const [asignaturas, setAsignaturas] = useState(() => {
    const saved = localStorage.getItem("studygo_subjects");
    return saved ? JSON.parse(saved) : [
      { name: "Diseño UX", professor: "Dra. Camila Ortiz", progress: "78%" },
      { name: "Programación React", professor: "Ing. Mateo Silva", progress: "92%" },
      { name: "Bases de Datos", professor: "Lic. Mariana Vega", progress: "64%" },
    ];
  });

  // 2. Estado para controlar el modal dentro de esta vista
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Efecto para guardar cambios automáticamente
  useEffect(() => {
    localStorage.setItem("studygo_subjects", JSON.stringify(asignaturas));
  }, [asignaturas]);

  // 4. Función para crear el nuevo curso
  const handleCreateSubject = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const professor = e.target.elements.professor.value;
    
    if (!name || !professor) return;

    const newSubject = {
      name,
      professor,
      progress: "0%", // El progreso inicia en 0%
    };

    setAsignaturas([...asignaturas, newSubject]);
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <PanelShell
      title="Mis Asignaturas"
      subtitle="Administra tus cursos y revisa el estado de cada asignatura en tiempo real."
    >
      {/* Botón superior para agregar una nueva asignatura */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-600 hover:shadow-lg"
        >
          + Agregar Asignatura
        </button>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {asignaturas.map((item) => (
          <div key={item.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-semibold text-cyan-600">{item.name}</p>
            <p className="mt-2 text-sm text-slate-500">Docente: {item.professor}</p>
            <div className="mt-4 h-2.5 rounded-full bg-slate-200">
              <div 
                className="h-2.5 rounded-full bg-cyan-500 transition-all duration-500" 
                style={{ width: item.progress }} 
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-700">Progreso: {item.progress}</p>
          </div>
        ))}
      </div>

      {/* Modal exclusivo de esta sección */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Nueva Asignatura"
      >
        <form onSubmit={handleCreateSubject} className="mt-2 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Nombre de la Asignatura</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Ej: Álgebra Lineal" 
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Docente</label>
            <input 
              type="text" 
              name="professor" 
              placeholder="Ej: Dra. Elena Montes" 
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-600"
          >
            Guardar Asignatura
          </button>
        </form>
      </Modal>

    </PanelShell>
  );
}

export default MisAsignaturas;
import React from "react";
import PanelShell from "../../components/common/PanelShell";

function Horarios() {
  // Configuración de la cuadrícula
  const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"
  ];
  
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Base de datos de eventos posicionados en la cuadrícula
  // dayCol: Lunes=2, Martes=3, Miércoles=4, Jueves=5, Viernes=6, Sábado=7
  // startRow: 08:00 AM = 2, 09:00 AM = 3, etc.
  const scheduleEvents = [
    {
      id: 1, type: "presencial", dayCol: 2, startRow: 2, span: 3,
      title: "MATEMÁTICA DISCRETA", location: "Aula 402 - Edificio B", footer: "Prof. Arnaldo Ruiz", icon: "📍"
    },
    {
      id: 2, type: "autoestudio", dayCol: 2, startRow: 5, span: 1,
      title: "REPASO: ALGEBRA", location: "Autoestudio", footer: "Objetivo: 2h", icon: "⚡"
    },
    {
      id: 3, type: "presencial", dayCol: 3, startRow: 3, span: 3,
      title: "FÍSICA APLICADA I", location: "Laboratorio de Óptica", footer: "Dra. Elena Costa", icon: "👩‍🔬"
    },
    {
      id: 4, type: "presencial", dayCol: 4, startRow: 2, span: 2,
      title: "MATEMÁTICA DISCRETA", location: "Aula 402 - Edificio B", footer: "Prof. Arnaldo Ruiz", icon: "📍"
    },
    {
      id: 5, type: "autoestudio", dayCol: 4, startRow: 4, span: 2,
      title: "LECTURA: PROGRAMACIÓN", location: "Autoestudio", footer: "Capítulo 4 y 5", icon: "📖"
    },
    {
      id: 6, type: "presencial", dayCol: 5, startRow: 3, span: 3,
      title: "FÍSICA APLICADA I", location: "Aula Magna", footer: "Dra. Elena Costa", icon: "👩‍🔬"
    },
    {
      id: 7, type: "presencial", dayCol: 5, startRow: 6, span: 2,
      title: "PROGRAMACIÓN II", location: "Laboratorio Central", footer: "Ing. Mario Valles", icon: "💻"
    },
    {
      id: 8, type: "autoestudio", dayCol: 6, startRow: 2, span: 2,
      title: "TALLER DE TESIS", location: "Investigación Libre", footer: "Redacción", icon: "✍️"
    },
    {
      id: 9, type: "presencial", dayCol: 6, startRow: 4, span: 2,
      title: "INGLÉS TÉCNICO III", location: "Aula 105 - Virtual", footer: "Lic. Martha Kent", icon: "🌐"
    },
    {
      id: 10, type: "autoestudio", dayCol: 7, startRow: 3, span: 3,
      title: "PROYECTO INTEGRADOR", location: "Reunión de Equipo", footer: "Biblioteca - Sala 8", icon: "👥"
    }
  ];

  return (
    <PanelShell
      title="Horario Semanal"
      subtitle="Organiza tus clases presenciales y optimiza tus sesiones de autoestudio."
    >
      
      {/* --- CABECERA: Leyenda y Botón Imprimir --- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-3">
          {/* Leyenda Presencial */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
            Clases Presenciales
          </div>
          {/* Leyenda Autoestudio */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="h-3 w-3 rounded-full border-2 border-dashed border-indigo-400 bg-transparent"></span>
            Autoestudio Sugerido
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800">
          🖨️ Imprimir Horario
        </button>
      </div>

      {/* --- CALENDARIO GRID --- */}
      <div className="relative w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Min-width asegura que no se aplasten las columnas en móviles */}
        <div className="grid min-w-[900px] grid-cols-[80px_repeat(6,1fr)] grid-rows-[auto_repeat(8,minmax(80px,1fr))]">
          
          {/* 1. Fila de Cabecera (Días) */}
          <div className="border-b border-slate-200 bg-slate-50 p-3 text-center text-xs font-bold text-slate-500">
            HORA
          </div>
          {days.map((day, idx) => (
            <div key={day} className="border-b border-l border-slate-200 bg-slate-50 p-3 text-center text-sm font-bold text-slate-800">
              {day}
            </div>
          ))}

          {/* 2. Cuadrícula de Fondo (Líneas y Horas) */}
          {hours.map((hour, rowIdx) => (
            <React.Fragment key={hour}>
              {/* Celda de la hora (Columna 1) */}
              <div 
                className="border-b border-slate-100 p-3 text-center text-[11px] font-medium text-slate-400"
                style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
              >
                {hour}
              </div>
              {/* Celdas vacías para formar las líneas del calendario */}
              {days.map((_, colIdx) => (
                <div 
                  key={`bg-${rowIdx}-${colIdx}`} 
                  className="border-b border-l border-slate-100"
                  style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* 3. Bloques de Eventos (Se sobreponen a la cuadrícula) */}
          {scheduleEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                gridRow: `${ev.startRow} / span ${ev.span}`,
                gridColumn: ev.dayCol,
              }}
              className="p-1 z-10" // Padding externo para no tocar las líneas
            >
              <div 
                className={`h-full w-full rounded-lg p-3 flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-pointer ${
                  ev.type === "presencial" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-white border-2 border-dashed border-indigo-300 text-indigo-800 shadow-sm"
                }`}
              >
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${ev.type === "presencial" ? "text-white" : "text-indigo-900"}`}>
                    {ev.title}
                  </h4>
                  <p className={`mt-1 text-[11px] leading-tight ${ev.type === "presencial" ? "text-indigo-100" : "text-indigo-500 font-medium"}`}>
                    {ev.location}
                  </p>
                </div>
                
                <div className={`mt-2 flex items-center gap-1.5 text-[11px] font-medium ${ev.type === "presencial" ? "text-indigo-200" : "text-indigo-600"}`}>
                  <span>{ev.icon}</span> {ev.footer}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* --- TARJETAS DE RESUMEN (Inferior) --- */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            ⏱️
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Horas/Semana</p>
            <p className="text-lg font-bold text-slate-800">32 Horas</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            ✨
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Foco de Estudio</p>
            <p className="text-lg font-bold text-slate-800">Alto (85%)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            📅
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Próximo Examen</p>
            <p className="text-lg font-bold text-slate-800">Física - 3 días</p>
          </div>
        </div>

      </div>

      {/* Botón Flotante (FAB) temporal */}
      <button className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-lg transition-transform hover:scale-110 hover:bg-indigo-700">
        +
      </button>

    </PanelShell>
  );
}

export default Horarios;
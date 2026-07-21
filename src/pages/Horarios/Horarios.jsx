import React, { useState, useEffect } from "react";
import PanelShell from "../../components/common/PanelShell";

function Horarios() {
  // Ampliamos las horas para abarcar clases de tarde (hasta las 6 PM)
  const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM"
  ];
  
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Estados para almacenar nuestros datos del LocalStorage
  const [mySubjects, setMySubjects] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);

  // Función para convertir el texto "Lun, Mié 10:00 - 12:00" en bloques del calendario
  const parseSchedules = (subjects) => {
    const events = [];
    let eventId = 1;

    // Diccionario para mapear texto a la columna del grid
    const dayMap = {
      "lun": 2, "mar": 3, "mié": 4, "mie": 4,
      "jue": 5, "vie": 6, "sáb": 7, "sab": 7
    };

    subjects.forEach(sub => {
      if (!sub.horario) return;
      
      const text = sub.horario.toLowerCase();
      const daysFound = [];
      
      // 1. Encontrar qué días están en el texto
      Object.keys(dayMap).forEach(key => {
        if (text.includes(key) && !daysFound.includes(dayMap[key])) {
          daysFound.push(dayMap[key]);
        }
      });

      // 2. Encontrar las horas (Ej: 10:00 - 12:00)
      // Esta expresión regular busca dos números separados por un guion o letra
      const timeRegex = /(\d{1,2}):\d{2}\s*(?:-|a|al|y)\s*(\d{1,2}):\d{2}/;
      const match = text.match(timeRegex);

      if (daysFound.length > 0 && match) {
        const startHour = parseInt(match[1]); // ej: 10
        const endHour = parseInt(match[2]);   // ej: 12

        // La fila 2 es 08:00 AM. Así que restamos 6 a la hora en formato 24h.
        const startRow = startHour - 6; 
        const span = endHour - startHour; // Duración en horas

        if (startRow > 0 && span > 0) {
          daysFound.forEach(dayCol => {
            events.push({
              id: eventId++,
              type: "presencial", 
              dayCol: dayCol,
              startRow: startRow,
              span: span,
              title: sub.name.toUpperCase(),
              location: sub.aula || "Sin aula",
              footer: sub.teacher || "",
              icon: "📍"
            });
          });
        }
      }
    });

    return events;
  };

  // Cargar datos desde LocalStorage al iniciar el componente
  useEffect(() => {
    const saved = localStorage.getItem("studygo_subjects");
    if (saved) {
      const parsedSubjects = JSON.parse(saved);
      setMySubjects(parsedSubjects);
      setScheduleEvents(parseSchedules(parsedSubjects));
    }
  }, []);

  return (
    <PanelShell
      title="Horario Semanal"
      subtitle="Visualiza las clases que has creado y organizado en tu panel de asignaturas."
    >
      
      {/* --- CABECERA --- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
            Tus Clases
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
        >
          🖨️ Imprimir Horario
        </button>
      </div>

      {/* --- CALENDARIO GRID --- */}
      <div className="relative w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Actualizamos grid-rows para que coincida con las 11 horas (auto + 11 = 12) */}
        <div className="grid min-w-[900px] grid-cols-[80px_repeat(6,1fr)] grid-rows-[auto_repeat(11,minmax(80px,1fr))]">
          
          {/* 1. Fila de Cabecera (Días) */}
          <div className="border-b border-slate-200 bg-slate-50 p-3 text-center text-xs font-bold text-slate-500">
            HORA
          </div>
          {days.map((day) => (
            <div key={day} className="border-b border-l border-slate-200 bg-slate-50 p-3 text-center text-sm font-bold text-slate-800">
              {day}
            </div>
          ))}

          {/* 2. Cuadrícula de Fondo (Líneas y Horas) */}
          {hours.map((hour, rowIdx) => (
            <React.Fragment key={hour}>
              <div 
                className="border-b border-slate-100 p-3 text-center text-[11px] font-medium text-slate-400"
                style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
              >
                {hour}
              </div>
              {days.map((_, colIdx) => (
                <div 
                  key={`bg-${rowIdx}-${colIdx}`} 
                  className="border-b border-l border-slate-100"
                  style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* 3. Bloques de Eventos Generados desde LocalStorage */}
          {scheduleEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                gridRow: `${ev.startRow} / span ${ev.span}`,
                gridColumn: ev.dayCol,
              }}
              className="p-1 z-10"
            >
              <div className="h-full w-full rounded-lg bg-indigo-600 p-3 flex flex-col justify-between text-white shadow-md transition-transform hover:scale-[1.02] cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold leading-tight truncate" title={ev.title}>
                    {ev.title}
                  </h4>
                  <p className="mt-1 text-[11px] leading-tight text-indigo-100 truncate">
                    {ev.location}
                  </p>
                </div>
                
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-indigo-200 truncate">
                  <span>{ev.icon}</span> {ev.footer}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* --- LISTA DE ASIGNATURAS Y SUS HORARIOS EXACTOS --- */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Detalle de Asignaturas</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mySubjects.length > 0 ? (
            mySubjects.map((sub, idx) => (
              <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  📚
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{sub.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{sub.teacher}</p>
                  <p className="text-xs font-semibold text-indigo-600 mt-2 flex items-center gap-1.5">
                    🕒 {sub.horario ? sub.horario : "Sin horario asignado"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 col-span-full">No has creado ninguna asignatura aún. Ve a la pestaña "Mis Asignaturas" para agregar algunas.</p>
          )}
        </div>
      </div>

    </PanelShell>
  );
}

export default Horarios;
import PanelShell from "../../components/common/PanelShell";

function MiAgenda() {
  const items = [
    { title: "Revisión de proyecto", time: "09:00 - 10:00", category: "Académico" },
    { title: "Tutoría de UX", time: "11:30 - 12:15", category: "Mentoría" },
    { title: "Entrega de tarea", time: "18:00", category: "Pendiente" },
  ];

  return (
    <PanelShell
      title="Mi Agenda"
      subtitle="Consulta tus clases, reuniones y tareas pendientes desde un solo lugar."
      actionLabel="Nuevo evento"
      onAction={() => {}}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Próximos eventos</h3>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Resumen</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">4 tareas</p>
          <p className="mt-1 text-sm text-slate-500">2 próximas hoy y 1 en revisión.</p>
        </div>
      </div>
    </PanelShell>
  );
}

export default MiAgenda;

import PanelShell from "../../components/common/PanelShell";

function Horarios() {
  const schedule = [
    { day: "Lunes", time: "09:00 - 11:00", subject: "Diseño UX" },
    { day: "Martes", time: "10:00 - 12:00", subject: "Programación React" },
    { day: "Miércoles", time: "08:00 - 09:30", subject: "Bases de Datos" },
  ];

  return (
    <PanelShell
      title="Horarios"
      subtitle="Consulta tu distribución semanal de clases y actividades."
    >
      <div className="space-y-3">
        {schedule.map((item) => (
          <div key={item.day} className="flex flex-col gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-800">{item.day}</p>
              <p className="text-sm text-slate-500">{item.subject}</p>
            </div>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export default Horarios;

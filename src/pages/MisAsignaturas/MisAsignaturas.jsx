import PanelShell from "../../components/common/PanelShell";

function MisAsignaturas() {
  const asignaturas = [
    { name: "Diseño UX", teacher: "Dra. Camila Ortiz", progress: "78%" },
    { name: "Programación React", teacher: "Ing. Mateo Silva", progress: "92%" },
    { name: "Bases de Datos", teacher: "Lic. Mariana Vega", progress: "64%" },
  ];

  return (
    <PanelShell
      title="Mis Asignaturas"
      subtitle="Administra tus cursos y revisa el estado de cada asignatura en tiempo real."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {asignaturas.map((item) => (
          <div key={item.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-cyan-600">{item.name}</p>
            <p className="mt-2 text-sm text-slate-500">Docente: {item.teacher}</p>
            <div className="mt-4 h-2.5 rounded-full bg-slate-200">
              <div className="h-2.5 rounded-full bg-cyan-500" style={{ width: item.progress }} />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-700">Progreso: {item.progress}</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export default MisAsignaturas;

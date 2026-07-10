import PanelShell from "../../components/common/PanelShell";

function Directorio() {
  const people = [
    { name: "Dra. Camila Ortiz", role: "Coordinadora UX" },
    { name: "Ing. Mateo Silva", role: "Docente de React" },
    { name: "Lic. Mariana Vega", role: "Docente de Bases" },
  ];

  return (
    <PanelShell
      title="Directorio"
      subtitle="Encuentra docentes, coordinadores y personal académico en un solo listado."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {people.map((person) => (
          <div key={person.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
              {person.name.charAt(0)}
            </div>
            <p className="mt-3 font-semibold text-slate-800">{person.name}</p>
            <p className="text-sm text-slate-500">{person.role}</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export default Directorio;

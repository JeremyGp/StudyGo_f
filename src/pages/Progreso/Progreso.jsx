import PanelShell from "../../components/common/PanelShell";

function Progreso() {
  return (
    <PanelShell
      title="Progreso"
      subtitle="Visualiza tu avance semanal y el rendimiento de tus actividades académicas."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Avance general</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">84%</p>
          <div className="mt-4 h-3 rounded-full bg-slate-200">
            <div className="h-3 w-[84%] rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-amber-50 to-orange-100 p-4">
          <p className="text-sm font-semibold text-slate-500">Meta mensual</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">+12%</p>
          <p className="mt-1 text-sm text-slate-600">Continúa así para concluir el ciclo con buen rendimiento.</p>
        </div>
      </div>
    </PanelShell>
  );
}

export default Progreso;

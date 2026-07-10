import PanelShell from "../../components/common/PanelShell";

function Ajustes() {
  return (
    <PanelShell
      title="Ajustes"
      subtitle="Personaliza tu experiencia y configura tus preferencias académicas."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-800">Notificaciones</p>
          <p className="mt-1 text-sm text-slate-500">Activa recordatorios de tareas y eventos.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-800">Tema</p>
          <p className="mt-1 text-sm text-slate-500">Elige entre modo claro o oscuro según tu preferencia.</p>
        </div>
      </div>
    </PanelShell>
  );
}

export default Ajustes;

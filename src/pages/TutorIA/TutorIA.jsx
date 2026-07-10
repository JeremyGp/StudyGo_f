import PanelShell from "../../components/common/PanelShell";

function TutorIA() {
  return (
    <PanelShell
      title="Tutor IA"
      subtitle="Recibe recomendaciones personalizadas para tu aprendizaje y planificación."
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Asistente inteligente</p>
        <h3 className="mt-3 text-2xl font-semibold">Tu guía académica está lista</h3>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Puedes pedir ayuda para resumir contenidos, planificar tareas o mejorar tu ruta de estudio.
        </p>
      </div>
    </PanelShell>
  );
}

export default TutorIA;

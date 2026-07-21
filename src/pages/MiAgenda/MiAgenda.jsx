import { useMemo, useState } from "react";
import PanelShell from "../../components/common/PanelShell";
import { useAgenda } from "../../hooks/useAgenda";

function MiAgenda() {
  const {
    asignaturas,
    tareas,
    seleccionada,
    cargando,
    error,
    cambiarAsignatura,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    generarSubtareas,
    generarRecordatorio,
  } = useAgenda();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_limite: "",
    prioridad: "Alta",
    horas_estimadas: 2,
  });

  const resumen = useMemo(() => {
    const completadas = tareas.filter((t) => t.estado === "Completada").length;
    const pendientes = tareas.filter((t) => t.estado === "Pendiente").length;
    return { completadas, pendientes };
  }, [tareas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.fecha_inicio || !form.fecha_limite) return;

    await crearTarea({
      ...form,
      fecha_inicio: new Date(form.fecha_inicio).toISOString(),
      fecha_limite: new Date(form.fecha_limite).toISOString(),
      prioridad: form.prioridad,
      horas_estimadas: Number(form.horas_estimadas),
    });

    setForm({
      titulo: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_limite: "",
      prioridad: "Alta",
      horas_estimadas: 2,
    });
  };

  const toggleEstado = async (tarea) => {
    const siguienteEstado = tarea.estado === "Completada" ? "Pendiente" : "Completada";
    await actualizarTarea(tarea.id_tarea, { estado: siguienteEstado });
  };

  const planificarTarea = async (tarea) => {
    await generarSubtareas(tarea.id_tarea, {
      titulo: `Subtarea de ${tarea.titulo}`,
      descripcion: "Paso inicial recomendado",
      estado: "Pendiente",
      orden: 1,
    });
    await generarRecordatorio(tarea.id_tarea, {
      titulo: `Recordatorio: ${tarea.titulo}`,
      mensaje: `Tu tarea ${tarea.titulo} requiere seguimiento hoy.`,
      estado: true,
    });
  };

  return (
    <PanelShell
      title="Mi Agenda"
      subtitle="Organiza tus asignaturas, tareas y recordatorios desde un solo lugar."
      actionLabel="Nueva tarea"
      onAction={() => {}}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Tareas por asignatura</h3>
            <select
              value={seleccionada || ""}
              onChange={(e) => cambiarAsignatura(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
                  {asignatura.nombre}
                </option>
              ))}
            </select>
          </div>

          {cargando ? (
            <p className="mt-4 text-sm text-slate-500">Cargando tareas...</p>
          ) : error ? (
            <p className="mt-4 text-sm text-rose-600">{error}</p>
          ) : (
            <div className="mt-4 space-y-3">
              {tareas.map((tarea) => (
                <div key={tarea.id_tarea} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{tarea.titulo}</p>
                      <p className="text-sm text-slate-500">{tarea.descripcion || "Sin descripción"}</p>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {tarea.prioridad}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>Inicio: {new Date(tarea.fecha_inicio).toLocaleDateString()}</span>
                    <span>Fin: {new Date(tarea.fecha_limite).toLocaleDateString()}</span>
                    <span>Estado: {tarea.estado}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white"
                      onClick={() => toggleEstado(tarea)}
                    >
                      {tarea.estado === "Completada" ? "Marcar pendiente" : "Marcar completada"}
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                      onClick={() => planificarTarea(tarea)}
                    >
                      Planificar
                    </button>
                    <button
                      className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-600"
                      onClick={() => eliminarTarea(tarea.id_tarea)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
            <p className="text-sm font-semibold text-slate-500">Resumen</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{tareas.length} tareas</p>
            <p className="mt-1 text-sm text-slate-500">
              {resumen.completadas} completadas · {resumen.pendientes} pendientes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Crear tarea</h3>
            <div className="mt-3 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
              <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.fecha_inicio}
                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                />
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.fecha_limite}
                  onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.prioridad}
                  onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={form.horas_estimadas}
                  onChange={(e) => setForm({ ...form, horas_estimadas: Number(e.target.value) })}
                />
              </div>
              <button className="w-full rounded-xl bg-cyan-600 px-3 py-2 font-semibold text-white" type="submit">
                Guardar tarea
              </button>
            </div>
          </form>
        </div>
      </div>
    </PanelShell>
  );
}

export default MiAgenda;

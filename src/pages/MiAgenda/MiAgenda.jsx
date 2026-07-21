import { useCallback, useEffect, useMemo, useState } from "react";

import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal";
import { asignaturaService } from "../../services/asignatura";
import { horarioService } from "../../services/horario";
import { tareaService } from "../../services/tarea";

const DAY_INDEX = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

const PRIORITY_STYLES = {
  Alta: "bg-rose-100 text-rose-700",
  Media: "bg-amber-100 text-amber-700",
  Baja: "bg-emerald-100 text-emerald-700",
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isCompleted = (status) =>
  ["completada", "completado"].includes(normalize(status));

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback;

const combineDateAndTime = (date, time) => {
  const result = new Date(date);
  const [hours, minutes] = String(time).slice(0, 5).split(":").map(Number);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const getNextClassOccurrence = (schedule, now) => {
  const targetDay = DAY_INDEX[normalize(schedule.dia_semana)];
  if (targetDay === undefined) return null;
  const occurrenceDate = new Date(now);
  const offset = (targetDay - now.getDay() + 7) % 7;
  occurrenceDate.setDate(now.getDate() + offset);
  const start = combineDateAndTime(occurrenceDate, schedule.hora_inicio);
  const end = combineDateAndTime(occurrenceDate, schedule.hora_fin);
  if (end < now) {
    start.setDate(start.getDate() + 7);
    end.setDate(end.getDate() + 7);
  }
  return { start, end };
};

function MiAgenda() {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState({ open: false, type: "create", task: null });

  const loadAgenda = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const subjectData = await asignaturaService.listar();
      const [taskGroups, scheduleGroups] = await Promise.all([
        Promise.all(subjectData.map((subject) => tareaService.listar(subject.id_asignatura))),
        Promise.all(subjectData.map((subject) => horarioService.listar(subject.id_asignatura))),
      ]);

      setSubjects(subjectData);
      setTasks(
        subjectData.flatMap((subject, index) =>
          taskGroups[index].map((task) => ({ ...task, asignatura: subject }))
        )
      );
      setClasses(
        subjectData.flatMap((subject, index) =>
          scheduleGroups[index].map((schedule) => ({ ...schedule, asignatura: subject }))
        )
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible cargar la agenda."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [loadAgenda]);

  const agendaItems = useMemo(() => {
    const now = new Date();
    const classItems = classes
      .map((schedule) => {
        const occurrence = getNextClassOccurrence(schedule, now);
        if (!occurrence) return null;
        return {
          id: `class-${schedule.id_horario}`,
          type: "class",
          date: occurrence.start,
          end: occurrence.end,
          id_asignatura: schedule.id_asignatura,
          title: schedule.asignatura.nombre,
          subtitle: schedule.asignatura.docente,
          schedule,
        };
      })
      .filter(Boolean);

    const taskItems = tasks
      .map((task) => {
        const date = new Date(task.fecha_inicio_sugerida || task.fecha_inicio || task.fecha_limite);
        if (Number.isNaN(date.getTime())) return null;
        return {
          id: `task-${task.id_tarea}`,
          type: "task",
          date,
          end: task.fecha_limite ? new Date(task.fecha_limite) : null,
          id_asignatura: task.id_asignatura,
          title: task.titulo,
          subtitle: task.asignatura.nombre,
          task,
        };
      })
      .filter(Boolean);

    return [...classItems, ...taskItems]
      .filter((item) => subjectFilter === "all" || item.id_asignatura === Number(subjectFilter))
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => {
        const term = normalize(search.trim());
        return !term || normalize(`${item.title} ${item.subtitle}`).includes(term);
      })
      .sort((a, b) => a.date - b.date);
  }, [classes, tasks, subjectFilter, typeFilter, search]);

  const groupedItems = useMemo(() => {
    return agendaItems.reduce((groups, item) => {
      const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}-${String(item.date.getDate()).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  }, [agendaItems]);

  const summary = useMemo(
    () => ({
      pending: tasks.filter((task) => !isCompleted(task.estado)).length,
      completed: tasks.filter((task) => isCompleted(task.estado)).length,
      classes: classes.length,
    }),
    [tasks, classes]
  );

  const runAction = async (action, message) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await action();
      setSuccess(message);
      setModal({ open: false, type: "create", task: null });
      await loadAgenda();
    } catch (actionError) {
      setError(getErrorMessage(actionError, "No fue posible completar la operación."));
    } finally {
      setSaving(false);
    }
  };

  const createTask = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction(
      () =>
        tareaService.crear(Number(form.get("id_asignatura")), {
          titulo: form.get("titulo").trim(),
          descripcion: form.get("descripcion").trim() || null,
          fecha_inicio: form.get("fecha_inicio"),
          fecha_limite: form.get("fecha_limite"),
          prioridad: form.get("prioridad"),
          horas_estimadas: Number(form.get("horas_estimadas")),
        }),
      "Tarea creada correctamente."
    );
  };

  const toggleTask = (task) =>
    runAction(
      () =>
        tareaService.actualizar(task.id_tarea, {
          estado: isCompleted(task.estado) ? "Pendiente" : "Completada",
        }),
      "Estado de la tarea actualizado."
    );

  const planTask = (task) =>
    runAction(
      async () => {
        await tareaService.planificar(task.id_tarea);
        await tareaService.generarSubtareas(task.id_tarea);
        await tareaService.generarRecordatorios(task.id_tarea);
      },
      "La tarea fue planificada y se generaron sus recomendaciones."
    );

  const deleteTask = () =>
    runAction(
      () => tareaService.eliminar(modal.task.id_tarea),
      "Tarea eliminada correctamente."
    );

  return (
    <PanelShell
      title="Mi Agenda"
      subtitle="Consulta tus próximas clases y tareas en una lista cronológica."
    >
      {error && <Message tone="error">{error}</Message>}
      {success && <Message tone="success">{success}</Message>}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Summary label="Tareas pendientes" value={summary.pending} color="text-amber-600" />
        <Summary label="Tareas completadas" value={summary.completed} color="text-emerald-600" />
        <Summary label="Clases semanales" value={summary.classes} color="text-indigo-600" />
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar clases o tareas..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
        />
        <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="all">Todas las asignaturas</option>
          {subjects.map((subject) => <option key={subject.id_asignatura} value={subject.id_asignatura}>{subject.nombre}</option>)}
        </select>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="all">Clases y tareas</option>
          <option value="class">Solo clases</option>
          <option value="task">Solo tareas</option>
        </select>
        <button
          type="button"
          disabled={!subjects.length}
          onClick={() => setModal({ open: true, type: "create", task: null })}
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          + Nueva tarea
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">Cargando agenda...</div>
      ) : agendaItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No hay clases o tareas que coincidan con los filtros.
        </div>
      ) : (
        <div className="space-y-7">
          {Object.entries(groupedItems).map(([date, items]) => (
            <section key={date}>
              <DateHeading date={new Date(`${date}T00:00:00`)} />
              <div className="mt-3 space-y-3 border-l-2 border-slate-200 pl-5">
                {items.map((item) =>
                  item.type === "class" ? (
                    <ClassItem key={item.id} item={item} />
                  ) : (
                    <TaskItem
                      key={item.id}
                      item={item}
                      saving={saving}
                      onToggle={() => toggleTask(item.task)}
                      onPlan={() => planTask(item.task)}
                      onDelete={() => setModal({ open: true, type: "delete", task: item.task })}
                    />
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => !saving && setModal({ open: false, type: "create", task: null })}
        title={modal.type === "delete" ? "Eliminar tarea" : "Nueva tarea"}
      >
        {modal.type === "delete" ? (
          <div className="space-y-5 text-center">
            <p>¿Deseas eliminar <strong>{modal.task?.titulo}</strong>?</p>
            <div className="flex gap-3">
              <button type="button" disabled={saving} onClick={() => setModal({ open: false, type: "create", task: null })} className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5">Cancelar</button>
              <button type="button" disabled={saving} onClick={deleteTask} className="flex-1 rounded-lg bg-rose-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Eliminando..." : "Eliminar"}</button>
            </div>
          </div>
        ) : (
          <TaskForm subjects={subjects} loading={saving} onSubmit={createTask} />
        )}
      </Modal>
    </PanelShell>
  );
}

function DateHeading({ date }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const key = date.toDateString();
  const prefix = key === today.toDateString() ? "Hoy · " : key === tomorrow.toDateString() ? "Mañana · " : "";
  return <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{prefix}{date.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</h2>;
}

function ClassItem({ item }) {
  return <article className="relative rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm"><span className="absolute -left-[29px] top-5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600" /><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold uppercase text-indigo-700">Clase</span><h3 className="mt-2 font-semibold text-slate-900">{item.title}</h3><p className="text-sm text-slate-500">{item.subtitle} · 📍 {item.schedule.aula}</p></div><p className="text-sm font-semibold text-indigo-700">{item.date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}–{item.end.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</p></div></article>;
}

function TaskItem({ item, saving, onToggle, onPlan, onDelete }) {
  const completed = isCompleted(item.task.estado);
  const overdue = !completed && item.end && item.end < new Date();
  return <article className={`relative rounded-2xl border bg-white p-4 shadow-sm ${overdue ? "border-rose-200" : "border-cyan-200"}`}><span className={`absolute -left-[29px] top-5 h-3.5 w-3.5 rounded-full border-2 border-white ${completed ? "bg-emerald-500" : overdue ? "bg-rose-500" : "bg-cyan-500"}`} /><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-bold uppercase text-cyan-700">Tarea</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${PRIORITY_STYLES[item.task.prioridad] || "bg-slate-100"}`}>{item.task.prioridad}</span>{overdue && <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700">Vencida</span>}</div><h3 className={`mt-2 font-semibold ${completed ? "text-slate-400 line-through" : "text-slate-900"}`}>{item.title}</h3><p className="text-sm text-slate-500">{item.subtitle} · {item.task.horas_estimadas} h estimadas</p><p className="mt-1 text-xs text-slate-400">Entrega: {item.end?.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</p></div><div className="flex flex-wrap gap-2"><button disabled={saving} onClick={onToggle} className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{completed ? "Reabrir" : "Completar"}</button><button disabled={saving || completed} onClick={onPlan} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Planificar</button><button disabled={saving} onClick={onDelete} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 disabled:opacity-50">Eliminar</button></div></div></article>;
}

function TaskForm({ subjects, loading, onSubmit }) {
  return <form onSubmit={onSubmit} className="space-y-4"><Field label="Título" name="titulo" required minLength={2} maxLength={150} /><label className="block text-sm font-medium text-slate-700">Descripción<textarea name="descripcion" rows={3} className="mt-1 w-full resize-none rounded-lg border border-slate-300 p-2.5" /></label><label className="block text-sm font-medium text-slate-700">Asignatura<select name="id_asignatura" required className="mt-1 w-full rounded-lg border border-slate-300 p-2.5">{subjects.map((subject) => <option key={subject.id_asignatura} value={subject.id_asignatura}>{subject.nombre}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><Field label="Fecha de inicio" name="fecha_inicio" type="datetime-local" required /><Field label="Fecha límite" name="fecha_limite" type="datetime-local" required /></div><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Prioridad<select name="prioridad" defaultValue="Media" className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"><option>Alta</option><option>Media</option><option>Baja</option></select></label><Field label="Horas estimadas" name="horas_estimadas" type="number" min="1" defaultValue="2" required /></div><button disabled={loading} className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{loading ? "Guardando..." : "Guardar tarea"}</button></form>;
}

function Field({ label, ...props }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input {...props} className="mt-1 w-full rounded-lg border border-slate-300 p-2.5" /></label>;
}

function Summary({ label, value, color }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p></div>;
}

function Message({ tone, children }) {
  return <div className={`mb-5 rounded-xl border p-3 text-sm ${tone === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{children}</div>;
}

export default MiAgenda;

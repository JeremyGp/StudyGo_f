import { useCallback, useEffect, useMemo, useState } from "react";

import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal";
import { asignaturaService } from "../../services/asignatura";
import { horarioService } from "../../services/horario";
import { tareaService } from "../../services/tarea";

const DAYS = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
];

const normalizeDay = (day) =>
  String(day || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatTime = (value) => String(value || "").slice(0, 5);

const DAY_BY_INDEX = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const CALENDAR_START_HOUR = 7;
const CALENDAR_END_HOUR = 22;
const SLOT_MINUTES = 30;
const TOTAL_SLOTS = ((CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60) / SLOT_MINUTES;
const TIME_SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, index) => {
  const totalMinutes = CALENDAR_START_HOUR * 60 + index * SLOT_MINUTES;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
});

const getWeekDays = () => {
  const today = new Date();
  const monday = new Date(today);
  const offset = (today.getDay() + 6) % 7;
  monday.setDate(today.getDate() - offset);
  monday.setHours(0, 0, 0, 0);
  return DAYS.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { ...day, date };
  });
};

const getCalendarPosition = (startValue, endValue) => {
  const toMinutes = (value) => {
    const [hour, minute] = formatTime(value).split(":").map(Number);
    return hour * 60 + minute;
  };
  const calendarStart = CALENDAR_START_HOUR * 60;
  const start = Math.max(calendarStart, toMinutes(startValue));
  const end = Math.min(CALENDAR_END_HOUR * 60, toMinutes(endValue));
  const startSlot = Math.min(
    TOTAL_SLOTS - 1,
    Math.max(0, Math.floor((start - calendarStart) / SLOT_MINUTES))
  );
  const span = Math.max(1, Math.ceil((end - start) / SLOT_MINUTES));
  return { row: startSlot + 2, span: Math.min(span, TOTAL_SLOTS - startSlot) };
};

const isCompleted = (status) =>
  ["completada", "completado"].includes(String(status || "").toLowerCase());

const durationInHours = (start, end) => {
  const [startHour, startMinute] = formatTime(start).split(":").map(Number);
  const [endHour, endMinute] = formatTime(end).split(":").map(Number);
  return Math.max(0, endHour + endMinute / 60 - startHour - startMinute / 60);
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback;

function Horarios() {
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState({ open: false, type: "create", schedule: null });
  const weekDays = useMemo(() => getWeekDays(), []);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const subjectData = await asignaturaService.listar();
      const [scheduleGroups, taskGroups] = await Promise.all([
        Promise.all(
          subjectData.map((subject) => horarioService.listar(subject.id_asignatura))
        ),
        Promise.all(
          subjectData.map((subject) => tareaService.listar(subject.id_asignatura))
        ),
      ]);
      const completeSchedules = subjectData.flatMap((subject, index) =>
        scheduleGroups[index].map((schedule) => ({
          ...schedule,
          asignatura: subject,
        }))
      );

      setSubjects(subjectData);
      setSchedules(completeSchedules);

      const pendingTasks = subjectData.flatMap((subject, index) =>
        taskGroups[index]
          .filter((task) => !isCompleted(task.estado))
          .map((task) => ({ ...task, asignatura: subject }))
      );
      const planResults = await Promise.allSettled(
        pendingTasks.map((task) => tareaService.obtenerPlanEstudio(task.id_tarea))
      );
      const now = new Date();
      const currentWeek = getWeekDays();
      const weekStart = currentWeek[0].date;
      const weekEnd = new Date(currentWeek[6].date);
      weekEnd.setHours(23, 59, 59, 999);
      const recommendedBlocks = pendingTasks.flatMap((task, index) => {
        const result = planResults[index];
        if (result.status !== "fulfilled") return [];
        const blocks = Array.isArray(result.value)
          ? result.value
          : result.value?.bloques || [];
        return blocks
          .filter((block) => {
            const start = new Date(block.inicio);
            return start >= now && start >= weekStart && start <= weekEnd;
          })
          .map((block, blockIndex) => ({
            ...block,
            id: `${task.id_tarea}-${blockIndex}-${block.inicio}`,
            tarea: task,
            id_asignatura: task.id_asignatura,
          }));
      });
      setRecommendations(recommendedBlocks);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible cargar los horarios."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const visibleSchedules = useMemo(() => {
    if (selectedSubject === "all") return schedules;
    return schedules.filter(
      (schedule) => schedule.id_asignatura === Number(selectedSubject)
    );
  }, [schedules, selectedSubject]);

  const schedulesByDay = useMemo(() => {
    const grouped = Object.fromEntries(DAYS.map((day) => [normalizeDay(day.value), []]));
    visibleSchedules.forEach((schedule) => {
      const key = normalizeDay(schedule.dia_semana);
      if (grouped[key]) grouped[key].push(schedule);
    });
    Object.values(grouped).forEach((items) =>
      items.sort((a, b) => formatTime(a.hora_inicio).localeCompare(formatTime(b.hora_inicio)))
    );
    return grouped;
  }, [visibleSchedules]);

  const visibleRecommendations = useMemo(() => {
    if (selectedSubject === "all") return recommendations;
    return recommendations.filter(
      (recommendation) => recommendation.id_asignatura === Number(selectedSubject)
    );
  }, [recommendations, selectedSubject]);

  const recommendationsByDay = useMemo(() => {
    const grouped = Object.fromEntries(DAYS.map((day) => [normalizeDay(day.value), []]));
    visibleRecommendations.forEach((recommendation) => {
      const start = new Date(recommendation.inicio);
      const key = normalizeDay(DAY_BY_INDEX[start.getDay()]);
      if (grouped[key]) grouped[key].push(recommendation);
    });
    Object.values(grouped).forEach((items) =>
      items.sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
    );
    return grouped;
  }, [visibleRecommendations]);

  const weeklyHours = useMemo(
    () =>
      visibleSchedules.reduce(
        (total, schedule) => total + durationInHours(schedule.hora_inicio, schedule.hora_fin),
        0
      ),
    [visibleSchedules]
  );

  const recommendedHours = useMemo(
    () =>
      visibleRecommendations.reduce(
        (total, recommendation) => total + Number(recommendation.horas || 0),
        0
      ),
    [visibleRecommendations]
  );

  const openCreate = () => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "create", schedule: null });
  };

  const openEdit = (schedule) => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "edit", schedule });
  };

  const openDelete = (schedule) => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "delete", schedule });
  };

  const closeModal = () => {
    if (!saving) setModal({ open: false, type: "create", schedule: null });
  };

  const saveSchedule = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      dia_semana: form.get("dia_semana"),
      hora_inicio: form.get("hora_inicio"),
      hora_fin: form.get("hora_fin"),
      aula: form.get("aula").trim(),
    };

    if (payload.hora_fin <= payload.hora_inicio) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (modal.type === "edit") {
        await horarioService.actualizar(modal.schedule.id_horario, payload);
        setSuccess("Horario actualizado correctamente.");
      } else {
        await horarioService.crear(Number(form.get("id_asignatura")), payload);
        setSuccess("Horario creado correctamente.");
      }
      setModal({ open: false, type: "create", schedule: null });
      await loadSchedules();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible guardar el horario."));
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async () => {
    setSaving(true);
    setError("");
    try {
      await horarioService.eliminar(modal.schedule.id_horario);
      setSuccess("Horario eliminado correctamente.");
      setModal({ open: false, type: "create", schedule: null });
      await loadSchedules();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible eliminar el horario."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelShell
      title="Horario semanal"
      subtitle="Registra los bloques de clase asociados a tus asignaturas."
    >
      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium text-slate-700">
          Mostrar asignatura
          <select
            value={selectedSubject}
            onChange={(event) => setSelectedSubject(event.target.value)}
            className="ml-3 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="all">Todas las asignaturas</option>
            {subjects.map((subject) => (
              <option key={subject.id_asignatura} value={subject.id_asignatura}>
                {subject.nombre}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Imprimir
          </button>
          <button
            type="button"
            onClick={openCreate}
            disabled={!subjects.length}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Agregar horario
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-indigo-600" /> Clases
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-cyan-500" /> Autoestudio recomendado (próximos 7 días)
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Cargando horario...
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Primero debes crear una asignatura en “Mis Asignaturas”.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <div
            className="grid min-w-[1200px]"
            style={{
              gridTemplateColumns: "72px repeat(7, minmax(150px, 1fr))",
              gridTemplateRows: `56px repeat(${TOTAL_SLOTS}, 32px)`,
            }}
          >
            <div className="sticky left-0 top-0 z-30 flex items-center justify-center border-b border-r border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
              HORA
            </div>
            {weekDays.map((day, index) => (
              <div
                key={day.value}
                style={{ gridColumn: index + 2, gridRow: 1 }}
                className="sticky top-0 z-20 flex flex-col items-center justify-center border-b border-r border-slate-200 bg-slate-50 text-sm font-bold text-slate-800"
              >
                <span>{day.label}</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {day.date.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}

            {TIME_SLOTS.map((time, slotIndex) => (
              <div key={`time-${time}`} className="contents">
                <div
                  style={{ gridColumn: 1, gridRow: slotIndex + 2 }}
                  className={`sticky left-0 z-20 border-r border-slate-200 bg-white px-2 pt-1 text-right text-[10px] text-slate-400 ${slotIndex % 2 === 0 ? "border-b border-slate-200" : "border-b border-slate-100"}`}
                >
                  {slotIndex % 2 === 0 ? time : ""}
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`${day.value}-${time}`}
                    style={{ gridColumn: dayIndex + 2, gridRow: slotIndex + 2 }}
                    className={`border-r ${slotIndex % 2 === 0 ? "border-b border-slate-200" : "border-b border-dashed border-slate-100"}`}
                  />
                ))}
              </div>
            ))}

            {weekDays.flatMap((day, dayIndex) =>
              (schedulesByDay[normalizeDay(day.value)] || []).map((schedule) => {
                const position = getCalendarPosition(schedule.hora_inicio, schedule.hora_fin);
                return (
                  <article
                    key={`class-${schedule.id_horario}-${day.value}`}
                    style={{
                      gridColumn: dayIndex + 2,
                      gridRow: `${position.row} / span ${position.span}`,
                    }}
                    onClick={() => openEdit(schedule)}
                    className="z-10 m-1 cursor-pointer overflow-hidden rounded-lg border border-indigo-700 bg-indigo-600 p-2 text-white shadow-md transition hover:z-20 hover:scale-[1.01]"
                    title={`${schedule.asignatura.nombre} · ${formatTime(schedule.hora_inicio)}–${formatTime(schedule.hora_fin)} · ${schedule.aula}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="truncate text-[11px] font-bold uppercase">{schedule.asignatura.nombre}</p>
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); openDelete(schedule); }}
                        className="rounded bg-black/15 px-1 text-[10px] hover:bg-rose-500"
                        aria-label="Eliminar horario"
                      >
                        ×
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold">{formatTime(schedule.hora_inicio)}–{formatTime(schedule.hora_fin)}</p>
                    <p className="truncate text-[10px] text-indigo-100">📍 {schedule.aula}</p>
                  </article>
                );
              })
            )}

            {weekDays.flatMap((day, dayIndex) =>
              (recommendationsByDay[normalizeDay(day.value)] || []).map((recommendation) => {
                const start = new Date(recommendation.inicio);
                const end = new Date(recommendation.fin);
                const startTime = start.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
                const endTime = end.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
                const position = getCalendarPosition(startTime, endTime);
                return (
                  <article
                    key={recommendation.id}
                    style={{
                      gridColumn: dayIndex + 2,
                      gridRow: `${position.row} / span ${position.span}`,
                    }}
                    className="z-10 m-1 overflow-hidden rounded-lg border-2 border-dashed border-cyan-400 bg-cyan-50 p-2 text-cyan-950 shadow-sm"
                    title={`${recommendation.tarea.titulo} · ${startTime}–${endTime}`}
                  >
                    <p className="truncate text-[9px] font-bold uppercase tracking-wide text-cyan-600">Autoestudio</p>
                    <p className="truncate text-[11px] font-bold">{recommendation.tarea.titulo}</p>
                    <p className="mt-1 text-[10px] font-semibold">{startTime}–{endTime}</p>
                    <p className="truncate text-[10px] text-cyan-700">{recommendation.tarea.asignatura.nombre}</p>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Horas de clase/semana" value={`${weeklyHours.toFixed(1)} h`} icon="⏱️" />
        <SummaryCard label="Autoestudio recomendado" value={`${recommendedHours.toFixed(1)} h`} icon="✨" />
        <SummaryCard label="Bloques recomendados" value={visibleRecommendations.length} icon="📅" />
      </div>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={
          modal.type === "delete"
            ? "Eliminar horario"
            : modal.type === "edit"
              ? "Editar horario"
              : "Agregar horario"
        }
      >
        {modal.type === "delete" ? (
          <div className="space-y-5 text-center">
            <p className="text-slate-700">
              ¿Deseas eliminar el horario de <strong>{modal.schedule?.asignatura.nombre}</strong> del {modal.schedule?.dia_semana}?
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={closeModal} disabled={saving} className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 disabled:opacity-50">Cancelar</button>
              <button type="button" onClick={deleteSchedule} disabled={saving} className="flex-1 rounded-lg bg-rose-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Eliminando..." : "Eliminar"}</button>
            </div>
          </div>
        ) : (
          <ScheduleForm
            subjects={subjects}
            schedule={modal.schedule}
            selectedSubject={selectedSubject}
            loading={saving}
            onSubmit={saveSchedule}
          />
        )}
      </Modal>
    </PanelShell>
  );
}

function ScheduleForm({ subjects, schedule, selectedSubject, loading, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Asignatura
        <select
          name="id_asignatura"
          defaultValue={schedule?.id_asignatura || (selectedSubject !== "all" ? selectedSubject : subjects[0]?.id_asignatura)}
          disabled={Boolean(schedule)}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 disabled:bg-slate-100"
        >
          {subjects.map((subject) => (
            <option key={subject.id_asignatura} value={subject.id_asignatura}>{subject.nombre}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Día de la semana
        <select name="dia_semana" defaultValue={schedule?.dia_semana || "Lunes"} className="mt-1 w-full rounded-lg border border-slate-300 p-2.5">
          {DAYS.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Hora de inicio" name="hora_inicio" type="time" defaultValue={formatTime(schedule?.hora_inicio) || "08:00"} required />
        <Field label="Hora de fin" name="hora_fin" type="time" defaultValue={formatTime(schedule?.hora_fin) || "10:00"} required />
      </div>
      <Field label="Aula o ubicación" name="aula" type="text" defaultValue={schedule?.aula} placeholder="Ej: Edificio B, aula 304" maxLength={50} required />
      <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? "Guardando..." : schedule ? "Guardar cambios" : "Guardar horario"}</button>
    </form>
  );
}

function Field({ label, ...props }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input {...props} className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" /></label>;
}

function SummaryCard({ label, value, icon }) {
  return <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">{icon}</div><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="text-lg font-bold text-slate-800">{value}</p></div></div>;
}

export default Horarios;

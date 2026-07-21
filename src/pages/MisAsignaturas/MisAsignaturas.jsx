import { useCallback, useEffect, useMemo, useState } from "react";

import PanelShell from "../../components/common/PanelShell";
import Modal from "../../components/ui/Modal";
import { asignaturaService } from "../../services/asignatura";
import { tareaService } from "../../services/tarea";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback;

const getProgressStyles = (progress) => {
  if (progress <= 30) return { bg: "bg-rose-500", text: "text-rose-600" };
  if (progress <= 60) return { bg: "bg-amber-500", text: "text-amber-600" };
  if (progress <= 85) return { bg: "bg-cyan-500", text: "text-cyan-600" };
  return { bg: "bg-emerald-500", text: "text-emerald-600" };
};

function MisAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [progressBySubject, setProgressBySubject] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState({ open: false, type: "create", subject: null });

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await asignaturaService.listar();
      const taskGroups = await Promise.all(
        data.map((subject) => tareaService.listar(subject.id_asignatura))
      );
      const progress = {};

      data.forEach((subject, index) => {
        const tasks = taskGroups[index];
        const completed = tasks.filter(
          (task) => String(task.estado).toLowerCase() === "completada"
        ).length;
        progress[subject.id_asignatura] = {
          total: tasks.length,
          completed,
          percentage: tasks.length
            ? Math.round((completed / tasks.length) * 100)
            : 0,
        };
      });

      setAsignaturas(data);
      setProgressBySubject(progress);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible cargar las asignaturas."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const filteredAsignaturas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return asignaturas;

    return asignaturas.filter((subject) =>
      [subject.nombre, subject.docente, subject.ciclo, subject.descripcion]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [asignaturas, searchTerm]);

  const closeModal = () => {
    if (!saving) setModal({ open: false, type: "create", subject: null });
  };

  const openCreateModal = () => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "create", subject: null });
  };

  const openEditModal = (subject) => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "edit", subject });
  };

  const openDeleteModal = (subject) => {
    setError("");
    setSuccess("");
    setModal({ open: true, type: "delete", subject });
  };

  const handleSaveSubject = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      nombre: form.get("nombre").trim(),
      descripcion: form.get("descripcion").trim() || null,
      ciclo: form.get("ciclo").trim(),
      docente: form.get("docente").trim(),
    };

    setSaving(true);
    setError("");
    try {
      if (modal.type === "edit") {
        await asignaturaService.actualizar(modal.subject.id_asignatura, payload);
        setSuccess("Asignatura actualizada correctamente.");
      } else {
        await asignaturaService.crear(payload);
        setSuccess("Asignatura creada correctamente.");
      }
      setModal({ open: false, type: "create", subject: null });
      await loadSubjects();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible guardar la asignatura."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async () => {
    setSaving(true);
    setError("");
    try {
      await asignaturaService.eliminar(modal.subject.id_asignatura);
      setSuccess("Asignatura eliminada correctamente.");
      setModal({ open: false, type: "create", subject: null });
      await loadSubjects();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible eliminar la asignatura."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelShell
      title="Mis Asignaturas"
      subtitle="Administra tus asignaturas y consulta su progreso real."
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

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 sm:max-w-md">
          <span className="text-slate-400">🔍</span>
          <input
            type="search"
            placeholder="Buscar por nombre, docente, ciclo o descripción..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <button
          onClick={openCreateModal}
          className="whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-600 hover:shadow-lg"
        >
          + Agregar asignatura
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Cargando asignaturas...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAsignaturas.map((subject) => {
            const progress = progressBySubject[subject.id_asignatura] || {
              total: 0,
              completed: 0,
              percentage: 0,
            };
            const styles = getProgressStyles(progress.percentage);

            return (
              <article
                key={subject.id_asignatura}
                className="flex min-h-64 flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold leading-tight text-cyan-700">
                        {subject.nombre}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        🎓 {subject.docente}
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {subject.ciclo}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm text-slate-500">
                    {subject.descripcion || "Sin descripción registrada."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {progress.completed} de {progress.total} tareas completadas
                    </span>
                    <span className={`text-sm font-bold ${styles.text}`}>
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${styles.bg}`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => openEditModal(subject)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(subject)}
                      className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredAsignaturas.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
              {asignaturas.length === 0
                ? "Todavía no tienes asignaturas. Crea la primera para comenzar."
                : "No se encontraron asignaturas que coincidan con la búsqueda."}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={
          modal.type === "delete"
            ? "Eliminar asignatura"
            : modal.type === "edit"
              ? "Editar asignatura"
              : "Agregar nueva asignatura"
        }
      >
        {modal.type === "delete" ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-600">
              !
            </div>
            <div>
              <p className="text-slate-700">
                ¿Estás seguro de que deseas eliminar <strong>{modal.subject?.nombre}</strong>?
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Esta acción puede afectar las tareas y horarios asociados.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteSubject}
                disabled={saving}
                className="flex-1 rounded-lg bg-rose-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ) : (
          <SubjectForm
            subject={modal.subject}
            loading={saving}
            onSubmit={handleSaveSubject}
          />
        )}
      </Modal>
    </PanelShell>
  );
}

function SubjectForm({ subject, loading, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mt-2 space-y-4">
      <FormField
        label="Nombre de la asignatura"
        name="nombre"
        defaultValue={subject?.nombre}
        placeholder="Ej: Álgebra lineal"
        required
      />
      <FormField
        label="Docente"
        name="docente"
        defaultValue={subject?.docente}
        placeholder="Ej: Dra. Elena Montes"
        required
      />
      <FormField
        label="Ciclo académico"
        name="ciclo"
        defaultValue={subject?.ciclo}
        placeholder="Ej: 2026-2"
        required
      />
      <label className="block text-sm font-medium text-slate-700">
        Descripción
        <textarea
          name="descripcion"
          defaultValue={subject?.descripcion || ""}
          maxLength={500}
          rows={4}
          placeholder="Información u observaciones sobre la asignatura"
          className="mt-1 w-full resize-none rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Guardando..." : subject ? "Guardar cambios" : "Guardar asignatura"}
      </button>
    </form>
  );
}

function FormField({ label, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      />
    </label>
  );
}

export default MisAsignaturas;

import { useCallback, useEffect, useState } from "react";
import { asignaturaService } from "../services/asignatura";
import { tareaService } from "../services/tarea";
import { notificacionService } from "../services/notificacion";

export function useAgenda() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

 const creandoRef = useRef(false);

const crearAsignaturaInicial = useCallback(async () => {
  if (creandoRef.current) return;
  creandoRef.current = true;
  try {
    const creada = await asignaturaService.crear(null, {
      nombre: "Asignatura inicial",
      descripcion: "Asignatura creada automáticamente para gestionar tus tareas.",
      ciclo: "Actual",
      docente: "Sin asignar",
    });
    setAsignaturas([creada]);
    setSeleccionada(creada.id_asignatura);
    return creada;
  } finally {
    creandoRef.current = false;
  }
}, []);
  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const dataAsignaturas = await asignaturaService.listar();
      const asignaturasData = dataAsignaturas || [];
      setAsignaturas(asignaturasData);

      if (asignaturasData.length) {
        const primera = asignaturasData[0];
        setSeleccionada(primera.id_asignatura);
        const dataTareas = await tareaService.listar(primera.id_asignatura);
        setTareas(dataTareas || []);
      } else {
        const creada = await crearAsignaturaInicial();
        const dataTareas = await tareaService.listar(creada.id_asignatura);
        setTareas(dataTareas || []);
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos");
    } finally {
      setCargando(false);
    }
  }, [crearAsignaturaInicial]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const cambiarAsignatura = async (idAsignatura) => {
    try {
      setSeleccionada(idAsignatura);
      const dataTareas = await tareaService.listar(idAsignatura);
      setTareas(dataTareas || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las tareas");
    }
  };

  const crearTarea = async (datos) => {
    let idAsignatura = seleccionada;

    if (!idAsignatura) {
      const creada = await crearAsignaturaInicial();
      idAsignatura = creada.id_asignatura;
    }

    const nueva = await tareaService.crear(idAsignatura, datos);
    setTareas((prev) => [nueva, ...prev]);
    return nueva;
  };

  const actualizarTarea = async (idTarea, datos) => {
    const actualizada = await tareaService.actualizar(idTarea, datos);
    setTareas((prev) => prev.map((t) => (t.id_tarea === idTarea ? actualizada : t)));
    return actualizada;
  };

  const eliminarTarea = async (idTarea) => {
    await tareaService.eliminar(idTarea);
    setTareas((prev) => prev.filter((t) => t.id_tarea !== idTarea));
  };

  const generarSubtareas = async (idTarea, datos) => {
    const subtarea = await tareaService.crearSubtarea(idTarea, datos);
    return subtarea;
  };

  const generarRecordatorio = async (idTarea, datos) => {
    const recordatorio = await notificacionService.crear(null, datos, idTarea);
    return recordatorio;
  };

  return {
    asignaturas,
    tareas,
    seleccionada,
    cargando,
    error,
    cargarDatos,
    cambiarAsignatura,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    generarSubtareas,
    generarRecordatorio,
  };
}

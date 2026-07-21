import axiosInstance from "../config/axiosInstance";

export const tareaService = {
  async crear(idAsignatura, datos) {
    const response = await axiosInstance.post(
      "/tareas",
      datos,
      {
        params: {
          id_asignatura: idAsignatura,
        },
      }
    );

    return response.data;
  },

  async obtenerPorId(idTarea) {
    const response = await axiosInstance.get(`/tareas/${idTarea}`);
    return response.data;
  },

  async listar(idAsignatura) {
    const response = await axiosInstance.get(
      "/tareas",
      {
        params: {
          id_asignatura: idAsignatura,
        },
      }
    );

    return response.data;
  },

  async actualizar(idTarea, datos) {
    const response = await axiosInstance.put(
      `/tareas/${idTarea}`,
      datos
    );

    return response.data;
  },

  async eliminar(idTarea) {
    await axiosInstance.delete(`/tareas/${idTarea}`);
  },

  async crearSubtarea(idTarea, datos) {
    const response = await axiosInstance.post(
      `/tareas/${idTarea}/subtareas`,
      datos
    );

    return response.data;
  },

  async listarSubtareas(idTarea) {
    const response = await axiosInstance.get(
      `/tareas/${idTarea}/subtareas`
    );

    return response.data;
  },

  async obtenerSubtarea(idTarea, idSubtarea) {
    const response = await axiosInstance.get(
      `/tareas/${idTarea}/subtareas/${idSubtarea}`
    );

    return response.data;
  },

  async actualizarSubtarea(idTarea, idSubtarea, datos) {
    const response = await axiosInstance.put(
      `/tareas/${idTarea}/subtareas/${idSubtarea}`,
      datos
    );

    return response.data;
  },

  async eliminarSubtarea(idTarea, idSubtarea) {
    await axiosInstance.delete(
      `/tareas/${idTarea}/subtareas/${idSubtarea}`
    );
  },
};
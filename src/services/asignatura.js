import axiosInstance from "../config/axiosInstance";

export const asignaturaService = {
  async crear(datos) {
    const response = await axiosInstance.post(
      "/asignaturas",
      datos
    );

    return response.data;
  },

  async obtenerPorId(idAsignatura) {
    const response = await axiosInstance.get(
      `/asignaturas/${idAsignatura}`
    );

    return response.data;
  },

  async listar() {
    const response = await axiosInstance.get(
      "/asignaturas"
    );

    return response.data;
  },

  async actualizar(idAsignatura, datos) {
    const response = await axiosInstance.put(
      `/asignaturas/${idAsignatura}`,
      datos
    );

    return response.data;
  },

  async eliminar(idAsignatura) {
    await axiosInstance.delete(`/asignaturas/${idAsignatura}`);
  },
};
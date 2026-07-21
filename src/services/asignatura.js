import axiosInstance from "../config/axiosInstance";

export const asignaturaService = {
  async crear(idUsuario, datos) {
    const response = await axiosInstance.post(
      `/asignaturas?id_usuario=${idUsuario}`,
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

  async listar(idUsuario) {
    const response = await axiosInstance.get(
      `/asignaturas?id_usuario=${idUsuario}`
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
import axiosInstance from "../config/axiosInstance";

export const horarioService = {
  async crear(idAsignatura, datos) {
    const response = await axiosInstance.post(
      "/horarios",
      datos,
      {
        params: {
          id_asignatura: idAsignatura,
        },
      }
    );

    return response.data;
  },

  async obtenerPorId(idHorario) {
    const response = await axiosInstance.get(
      `/horarios/${idHorario}`
    );

    return response.data;
  },

  async listar(idAsignatura) {
    const response = await axiosInstance.get(
      "/horarios",
      {
        params: {
          id_asignatura: idAsignatura,
        },
      }
    );

    return response.data;
  },

  async actualizar(idHorario, datos) {
    const response = await axiosInstance.put(
      `/horarios/${idHorario}`,
      datos
    );

    return response.data;
  },

  async eliminar(idHorario) {
    await axiosInstance.delete(`/horarios/${idHorario}`);
  },
};
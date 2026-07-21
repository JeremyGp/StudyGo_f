import axiosInstance from "../config/axiosInstance";

export const notificacionService = {
  async crear(_idUsuario, datos, idTarea = null) {
    let url = `/notificaciones`;

    if (idTarea !== null) {
      url += `?id_tarea=${idTarea}`;
    }

    const response = await axiosInstance.post(
      "/notificaciones",
      datos,
      config
    );

    return response.data;
  },

  async obtenerPorId(idNotificacion) {
    const response = await axiosInstance.get(`/notificaciones/${idNotificacion}`);

    return response.data;
  },

  async listar(_idUsuario) {
    const response = await axiosInstance.get(`/notificaciones`);

    return response.data;
  },

  async actualizar(idNotificacion, datos) {
    const response = await axiosInstance.put(
      `/notificaciones/${idNotificacion}`,
      datos
    );

    return response.data;
  },

  async eliminar(idNotificacion) {
    await axiosInstance.delete(
      `/notificaciones/${idNotificacion}`
    );
  },
};
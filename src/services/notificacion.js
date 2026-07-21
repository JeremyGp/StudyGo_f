import axiosInstance from "../config/axiosInstance";

export const notificacionService = {
  async crear(datos, idTarea = null) {
    const config = {};

    if (idTarea !== null) {
      config.params = {
        id_tarea: idTarea,
      };
    }

    const response = await axiosInstance.post(
      "/notificaciones",
      datos,
      config
    );

    return response.data;
  },

  async obtenerPorId(idNotificacion) {
    const response = await axiosInstance.get(
      `/notificaciones/${idNotificacion}`
    );

    return response.data;
  },

  async listar() {
    const response = await axiosInstance.get(
      "/notificaciones"
    );

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
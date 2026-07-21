import axiosInstance from "../config/axiosInstance";

export const usuarioService = {
  async crear(datos) {
    const response = await axiosInstance.post("/usuarios", datos);
    return response.data;
  },

  async obtenerPorId(idUsuario) {
    const response = await axiosInstance.get(`/usuarios/${idUsuario}`);
    return response.data;
  },

  async listar() {
    const response = await axiosInstance.get("/usuarios");
    return response.data;
  },

  async actualizar(idUsuario, datos) {
    const response = await axiosInstance.put(
      `/usuarios/${idUsuario}`,
      datos
    );

    return response.data;
  },

  async eliminar(idUsuario) {
    await axiosInstance.delete(`/usuarios/${idUsuario}`);
  },
};
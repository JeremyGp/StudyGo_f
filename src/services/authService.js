import axiosInstance from "../config/axiosInstance";

export const authService = {
  async login(correo, contrasena) {
    try {
      const response = await axiosInstance.post("/usuarios/login", {
        correo,
        contrasena,
      });

      localStorage.setItem(
        "authUser",
        JSON.stringify(response.data.usuario)
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        "Correo o contraseña incorrectos."
      );
    }
  },

  async register(nombre, correo, contrasena) {
    try {
      const response = await axiosInstance.post("/usuarios", {
        nombre,
        correo,
        contrasena,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        "No fue posible registrar el usuario."
      );
    }
  },

  logout() {
      localStorage.removeItem("authUser");
  },

  getCurrentUser() {
      const usuario = localStorage.getItem("authUser");
      return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated() {
      return this.getCurrentUser() !== null;
  },
};
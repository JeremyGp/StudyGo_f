import axiosInstance from "../config/axiosInstance";

export const authService = {
  async login(correo, contrasena) {
    try {
      const response = await axiosInstance.post("/usuarios/login", {
        correo,
        contrasena,
      });

      const { access_token, token_type, usuario } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("authUser", JSON.stringify(usuario));

      return {
        token: access_token,
        tokenType: token_type,
        user: usuario,
      };
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
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("authUser");
  },

  getCurrentUser() {
      const usuario = localStorage.getItem("authUser");
      return usuario ? JSON.parse(usuario) : null;
  },

  getToken() {
      return localStorage.getItem("token");
  },

  isAuthenticated() {
      return this.getToken() !== null;
  },
};
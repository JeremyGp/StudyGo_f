import axiosInstance from "../config/axiosInstance";

export const dashboardService = {
  async obtenerResumen() {
    const response = await axiosInstance.get(`/dashboard`);
    return response.data;
  },
};

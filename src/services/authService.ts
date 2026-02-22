import api from "./api";
import { userInfo } from "../store/userStore";

export const authService = {
  async register(userData: any) {
    try {
      const response = await api.post("/register/", userData);
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  async login(credentials: any) {
    try {
      const response = await api.post("/login/", credentials);

      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        if (response.data.user_name) {
          localStorage.setItem("user_name", response.data.user_name);
          localStorage.setItem("user_email", response.data.user_email);

          userInfo.set({
            name: response.data.user_name,
            email: response.data.user_email,
          });
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },
};

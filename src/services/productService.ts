import api from "./api";

export const productService = {
  async getAllProducts() {
    try {
      const response = await api.get("/products/");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      return [];
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const response = await api.get(`/products/${slug}/`);
      return response.data;
    } catch (error) {
      console.error(`Error buscando producto ${slug}:`, error);
      return null;
    }
  },
};

import { productService } from "../services/productService";

export const productController = {
  async getAllProducts(req: { query?: { category?: string } }) {
    const products = await productService.listProducts(req.query?.category);
    return { products, total: products.length };
  },

  async getProductDetails(productId: string) {
    const product = await productService.getProductById(productId);
    if (!product) throw new Error("Product not found");
    return product;
  }
};

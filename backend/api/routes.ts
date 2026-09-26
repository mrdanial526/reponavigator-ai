import { productController } from "./product.controller";
import { orderController } from "./order.controller";

export interface FastifyLikeApp {
  get: (path: string, handler: Function) => void;
  post: (path: string, handler: Function) => void;
}

export function registerApiRoutes(app: FastifyLikeApp) {
  // Product routes
  app.get("/api/products", async (req: any) => productController.getAllProducts(req));
  app.get("/api/products/:id", async (req: any) => productController.getProductDetails(req.params.id));

  // Order routes (Guarded by Auth Service middleware)
  app.post("/api/orders/create", async (req: any) => orderController.createOrder(req));
  app.get("/api/orders/:id", async (req: any) => orderController.getOrderById(req.params.id));
}

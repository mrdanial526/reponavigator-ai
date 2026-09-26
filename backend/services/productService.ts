export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
}

const MOCK_PRODUCTS: ProductRecord[] = [
  { id: "prod-1", name: "Apex Mechanical Keyboard", price: 129.99, description: "Wireless RGB keyboard with hot-swappable tactile switches.", category: "Hardware", inStock: true },
  { id: "prod-2", name: "Precision Gaming Mouse", price: 79.99, description: "Ultra-lightweight 26k DPI optical sensor with zero latency.", category: "Hardware", inStock: true },
  { id: "prod-3", name: "Developer Noise-Canceling Headset", price: 199.99, description: "Spatial audio with AI acoustic noise reduction mic.", category: "Audio", inStock: true },
  { id: "prod-4", name: "4K 144Hz IPS Gaming Monitor", price: 449.99, description: "HDR600 certified high-refresh display for software engineering.", category: "Displays", inStock: true }
];

export const productService = {
  async listProducts(category?: string): Promise<ProductRecord[]> {
    console.log(`[Database] Querying products filtered by category: ${category || "ALL"}`);
    if (!category) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  },

  async getProductById(id: string): Promise<ProductRecord | undefined> {
    return MOCK_PRODUCTS.find((p) => p.id === id);
  }
};

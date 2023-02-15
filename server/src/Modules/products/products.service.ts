import { Prisma, Products } from "@prisma/client";
import App from "app";

export class ProductsService {
    constructor(protected app: App) {}
  
    async getProducts() {
      return this.app.getDataSource().products.findMany();
    }

    async getProductById(productId: number) {
      return this.app.getDataSource().products.findUnique({ where: { id: productId } });
    }

    async addProduct(product: Prisma.ProductsCreateInput) {
      return this.app.getDataSource().products.create({
        data: product
      });
    }

    async updateProduct(productId: number, product: Prisma.ProductsUpdateInput) {
      return this.app.getDataSource().products.update({
        where: { id: productId },
        data: product
      });
    }

    async deleteProduct(productId: number) {
      return this.app.getDataSource().products.delete({ where: { id: productId } });
    }

    validateProduct(body: Record<string, any>): string[] {
        const errors = [];
        if(!body.product) {
            errors.push('Product name is required')
        }
        // if(body.quality) {
        //     errors.push('Quality is required')
        // }
        // if(!body.design) {
        //     errors.push('Design is required')
        // }
        // if(!body.color) {
        //     errors.push('Color is required')
        // }
        // if(!body.scale) {
        //     errors.push('Scale is required')
        // }
        // if(!body.materials) {
        //     errors.push('Materials is required')
        // }
        return errors;
    }
}
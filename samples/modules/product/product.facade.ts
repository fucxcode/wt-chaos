import { facade, get, post } from "../../../src/facade";
import { OperationContext } from "../../info/operation-context";
import { Context } from "../../../src/router";
import { inject } from "../../../src/container";
import { ProductService } from "./product.service";
import { ProductEntity } from "./product.entity";

@facade()
export class ProductFacade {

    @inject()
    private _productService!: ProductService;

    @get("/products")
    public async getProducts(ctx: Context<OperationContext>): Promise<any> {
        const pageIndex = Number(ctx.query.p || 0);
        const result = await this._productService.getProducts(ctx.state, pageIndex);
        return result;
    }

    @post("product")
    public async addProduct(ctx: Context<OperationContext>): Promise<any> {
        const product: ProductEntity = {
            name: ctx.requestBody.name
        };
        const result = await this._productService.addProduct(ctx.state, product);
        return result;
    }

}
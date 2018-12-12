import { injectable, inject } from "../../../src/container";
import { ProductRepository } from "./product.repository";
import { FindByPageIndexResult, OperationDescription } from "../../../src/repository";
import { ProductEntity } from "./product.entity";
import { OperationContext } from "../../info/operation-context";
import { Is } from "../../../src/constants";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src";

@injectable()
export class ProductService {

    @inject()
    private _productRepository!: ProductRepository;

    constructor() {
    }

    public async getProducts(operationContext: OperationContext, pageIndex: number): Promise<FindByPageIndexResult<ProductEntity>> {
        return await this._productRepository.findByPageIndex(OperationDescription.from(operationContext), {
            is_deleted: Is.no
        }, pageIndex);
    }

    public async addProduct(operationContext: OperationContext, entity: ProductEntity): Promise<Partial<ProductEntity> | undefined> {
        if (_.isNilOrWriteSpaces(entity.name)) {
            throw new WTError(WTCode.invalidInput, "product.name not specified");
        }
        
        return await this._productRepository.insertOne(OperationDescription.from(operationContext), entity);
    }

}
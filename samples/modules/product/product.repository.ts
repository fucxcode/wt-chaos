import { MongoDBRepository } from "../../core/mongodb-repository";
import { ProductEntity } from "./product.entity";
import { injectable } from "../../../src/container";

@injectable()
export class ProductRepository extends MongoDBRepository<ProductEntity> {

    constructor() {
        super(ProductEntity);
    }

}
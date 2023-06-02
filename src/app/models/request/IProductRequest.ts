import { IBrand } from "../brand";
import { ICategory } from "../category";

export interface IProductRequest {
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ICategory;
    brand: IBrand;
}
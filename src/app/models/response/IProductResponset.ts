import { IBrand } from "../brand";
import { ICategory } from "../category";


export interface IProductResponse {
    productId: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ICategory;
    brand: IBrand;
    totalQuantity?: Number ;
}
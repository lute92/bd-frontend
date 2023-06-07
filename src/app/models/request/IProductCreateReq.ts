import { IBrand } from "../brand";
import { ICategory } from "../category";
import { IProductImage } from "../product-image";

export interface IProductCreateReq {
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ICategory;
    brand: IBrand;
    images:IProductImage[];
}
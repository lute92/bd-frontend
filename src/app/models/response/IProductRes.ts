import { IBrand } from "../brand";
import { ICategory } from "../category";
import { IProductImage } from "../product-image";


export interface IProductRes {
    productId: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ICategory;
    brand: IBrand;
    totalQuantity?: Number ;
    images: IProductImage[];
}
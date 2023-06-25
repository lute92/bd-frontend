import { IBrand } from "../brand";
import { ICategory } from "../category";
import { IProductImage } from "../product-image";


export interface IProductRes {
    productId: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: string;
    brand: string;
    totalQuantity?: Number ;
    images: IProductImage[];
}
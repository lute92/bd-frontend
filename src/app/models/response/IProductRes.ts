import { IBrand } from "../brand";
import { ICategory } from "../category";
import { IProductImage } from "../product-image";
import { IProductBatch } from "../productBatch";


export interface IProductRes {
    _id: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: string;
    brand: string;
    totalQuantity?: Number ;
    images: IProductImage[];
    batches: IProductBatch[];
}
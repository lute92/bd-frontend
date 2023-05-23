import { IBrand } from "./brand";
import { ICategory } from "./category";
import { ICurrency } from "./currency";

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    brand: IBrand;
    price: number;
    quantity: number;
    currency: ICurrency;
    category: ICategory;
}
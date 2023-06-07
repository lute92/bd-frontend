import { IProductRes } from "./response/IProductRes";

export interface IProductImage {
    productImageId: string;
    product: IProductRes;
    url: string;
}
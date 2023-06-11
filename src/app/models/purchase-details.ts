import { IPurchase } from "./purchase";
import { IProductRes } from "./response/IProductRes";

export interface IPurchaseDetail extends Document {
    purchaseDetailid:string,
    purchase:IPurchase;
    product: IProductRes,
    quantity: number,
    purchasePrice: number,
    itemCost: number,
    expDate: Date,
    mnuDate: Date
}

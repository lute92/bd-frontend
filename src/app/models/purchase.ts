import { ICurrency } from "./currency";
import { IPurchaseDetail } from "./purchase-details";

export interface IPurchase extends Document {
    purchaseId:string,
    purchaseDate: number,
    currency: ICurrency,
    exchangeRate: number,
    note: string,
    purchaseDetails: IPurchaseDetail[]

}
import { ICurrency } from "./currency";
import { IPurchaseDetail } from "./purchase-details";

export interface IPurchase {
    purchaseId:string,
    purchaseDate: Date,
    currency: ICurrency,
    exchangeRate: number,
    extraCost: number,
    note: string,
    purchaseDetails: IPurchaseDetail[]

} 
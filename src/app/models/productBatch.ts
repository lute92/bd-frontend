export interface IProductBatch {
    _id?: string;
    createdDate: number;
    mnuDate: number;
    expDate: number;
    quantity: number;
    note: string;
    purchasePrice: number;
    sellingPrice: number;
    isPromotionItem: boolean;
    promotionPrice: number;
}
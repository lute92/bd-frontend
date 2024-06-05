import { IBrand } from "../brand";
import { ICategory } from "../category";
import { FileUploadResult } from "../fileupload-result";

export interface IProductReq {
    name: string;
    description: string;
    category: ICategory;
    brand: IBrand;
}

import { is } from "../../constants";
export interface IncludesOptions {
    includes?: {
        deleted?: is;
        archived?: is;
    };
}

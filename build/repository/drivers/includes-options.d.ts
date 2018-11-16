import { Is } from "../../constants";
export interface IncludesOptions {
    includes?: {
        deleted?: Is;
        archived?: Is;
    };
}

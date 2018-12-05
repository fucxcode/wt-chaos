import { parse } from "url";

export interface Id {

    toString(): string;

    equals(other: any): boolean;

}
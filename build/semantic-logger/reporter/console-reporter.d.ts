import { Reporter, OutPut } from "./interfaces";
declare class ConsoleReport implements Reporter {
    pretty: boolean;
    indent: number;
    constructor(opts: {
        pretty?: boolean;
        indent?: number;
    });
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}
export { ConsoleReport };

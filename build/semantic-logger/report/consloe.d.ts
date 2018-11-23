import { IReporter, OutPut } from "./interfaces";
declare class ConsoleReport implements IReporter {
    pretty: boolean;
    indent: number;
    constructor(opts: {
        pretty?: boolean;
        indent?: number;
    });
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}
export { ConsoleReport };

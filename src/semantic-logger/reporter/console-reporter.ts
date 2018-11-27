import { Reporter, OutPut } from "./interfaces";

class ConsoleReport implements Reporter {
    public pretty: boolean;
    public indent: number;

    constructor(pretty?: boolean, indent?: number) {
        this.pretty = pretty || false;
        this.indent = indent || 2;
    }

    public async report<T>(entity: OutPut<T>): Promise<OutPut<T>> {
        try {
            let outStr: string;
            outStr = this.pretty ? JSON.stringify(entity, null, this.indent) : JSON.stringify(entity);
            process.stdout.write(outStr + "\n");
        } catch (err) {
            return Promise.reject(err);
        } finally {
            return Promise.resolve(entity);
        }
    }
}

export { ConsoleReport };

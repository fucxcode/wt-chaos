import { Reporter, OutPut } from "./interfaces";

class ConsoleReport implements Reporter {
    public pretty: boolean;
    public indent: number;

    constructor(opts: { pretty?: boolean; indent?: number }) {
        this.pretty = opts.pretty || false;
        this.indent = opts.indent || 2;
    }

    public async report<T>(entity: OutPut<T>): Promise<OutPut<T>> {
        try {
            let outStr: string;
            outStr = this.pretty ? JSON.stringify(entity, null, this.indent) + "\n" : JSON.stringify(entity);
            process.stdout.write(outStr);
        } catch (err) {
            throw err;
        } finally {
            return Promise.resolve(entity);
        }
    }
}

export { ConsoleReport };

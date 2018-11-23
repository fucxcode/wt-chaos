"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleReport {
    constructor(opts) {
        this.pretty = opts.pretty || false;
        this.indent = opts.indent || 2;
    }
    async report(entity) {
        try {
            let outStr;
            outStr = this.pretty ? JSON.stringify(entity, null, this.indent) + "\n" : JSON.stringify(entity);
            process.stdout.write(outStr);
        }
        catch (err) {
            throw err;
        }
        finally {
            return Promise.resolve(entity);
        }
    }
}
exports.ConsoleReport = ConsoleReport;
//# sourceMappingURL=consloe.js.map
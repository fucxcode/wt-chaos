"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleReport {
    constructor(pretty, indent) {
        this.pretty = pretty || false;
        this.indent = indent || 2;
    }
    async report(entity) {
        try {
            let outStr;
            outStr = this.pretty ? JSON.stringify(entity, null, this.indent) : JSON.stringify(entity);
            process.stdout.write(outStr + "\n");
        }
        catch (err) {
            return Promise.reject(err);
        }
        finally {
            return Promise.resolve(entity);
        }
    }
}
exports.ConsoleReport = ConsoleReport;
//# sourceMappingURL=console-reporter.js.map
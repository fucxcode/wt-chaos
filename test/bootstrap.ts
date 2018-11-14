import * as _ from "../src/utilities";
import * as fs from "fs";
import * as path from "path";
import Mocha from "mocha";

const argv = require("minimist")(process.argv.slice(2));
const specs: string[] | undefined = _.isArray(argv.s)
    ? argv.s
    : _.isString(argv.s)
    ? [argv.s]
    : undefined;
const testDir = argv.dir || "./test";
const mocha = new Mocha({
    timeout: 999999,
    fullStackTrace: true
});

function loadSpecDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith(".spec.ts")) {
            const specName = file.replace(".spec.ts", "");
            if (
                !specs ||
                _.some(specs, x => x.toLowerCase() === specName.toLowerCase())
            ) {
                mocha.addFile(`${dir}/${file}`);
            }
        } else if (!file.includes(".")) {
            // folder
            loadSpecDir(`${dir}/${file}`);
        }
    }
}

loadSpecDir(testDir);

mocha.run(failures => {
    process.exitCode = failures ? -1 : 0;
});

const packageJson = require("../package.json");
const version_and_build = packageJson.version.split("-");
const version_segments = version_and_build[0].split(".");
const version = {
    major: version_segments[0] ? Number(version_segments[0]) : 1,
    minor: version_segments[1] ? Number(version_segments[1]) : 0,
    patch: version_segments[2] ? Number(version_segments[2]) : 0,
    build: version_and_build[1] ? Number(version_and_build[1]) : 0
};

const argv = require("minimist")(process.argv.slice(2));
const moment = require("moment");
const fs = require("fs");

const _getBuildNumber = function () {
    return moment().format("YYYYMMDDHHmm");
};

if (argv.upgrade) {
    switch (argv.upgrade) {
        case "patch":
            version.patch++;
            version.build = _getBuildNumber();
            break;
        case "minor":
            version.minor++;
            version.patch = 0;
            version.build = _getBuildNumber();
            break;
        case "major":
            version.major++;
            version.minor = 0;
            version.patch = 0;
            version.build = _getBuildNumber();
            break;
        default:
            version.build = _getBuildNumber();
            break;
    }

    const ver_string = `${version.major}.${version.minor}.${version.patch}-${version.build}`;
    console.log(`Next version is ${ver_string}.`);

    if (argv.save) {
        packageJson.version = ver_string;
        fs.writeFile("./package.json", JSON.stringify(packageJson, null, 2), (error) => {
            if (error) {
                console.log(`Failed to write "package.json" due to ${error}.`);
            }
            else {
                console.log(`Update version successfully in "package.json" with value ${ver_string}.`);
            }
        });
    }
}
else {
    console.log(JSON.stringify(version, null, 2));
}
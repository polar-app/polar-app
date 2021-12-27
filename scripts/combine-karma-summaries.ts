import path from "path";
import fs from "fs";

interface KarmaReporterSummary {
    summary: {
        [key: string]: number | boolean,
    }
    browsers: unknown[],
}

export async function readFileAsJson(path: string) {
    const data = await fs.promises.readFile(path);
    const pkg: KarmaReporterSummary = JSON.parse(data.toString("utf-8"));
    return pkg;
}

async function writeJsonToFile(path: string, json: any) {
    await fs.promises.writeFile(path, JSON.stringify(json, null, 2));
}

(async () => {
    const packagesDir = path.resolve(__dirname, '../packages');

    const dirs = await fs.promises.readdir(packagesDir);

    const combinedSummary: {
        [key: string]: { [key: string]: number | boolean },
    } = {};

    let i = 0;
    for (let dir of dirs) {
        const dirPath = path.resolve(packagesDir, dir);
        const isDir = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();

        // Ignore .DS_Store files etc
        if (!isDir) {
            continue;
        }

        // Ignore packages that don't have a Karma config
        if (!fs.existsSync(path.resolve(dirPath, 'karma-result.json'))) {
            continue;
        }

        const karmaResults = await readFileAsJson(path.resolve(dirPath, 'karma-result.json'));
        console.log(dir, karmaResults.summary);

        combinedSummary[dir] = karmaResults.summary;

        i++;
    }

    await writeJsonToFile(path.resolve(__dirname, '../combined-karma-result.json'), combinedSummary);

    console.log(combinedSummary);
})()

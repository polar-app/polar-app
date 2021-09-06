import fs from 'fs';
import * as readline from 'readline';
import {ESLint} from "./configs/ESLint";
import {TSConfig} from "./configs/TSConfig";
import {Package} from "./configs/Package";

// & Interfaces
interface PackageJson {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    scripts?: Scripts;
    devDependencies?: Record<string, unknown>;
    dependencies?: Record<string, unknown>;
}

interface Scripts {
    test?: string;
    mocha?: string;
    eslint?: string;
    eslintfix: string;
    compile?: string;
}

async function getUserInput(property: string): Promise<string> {
    return new Promise((resolve) => {
        const terminal: readline.Interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        terminal.question(property, (answer: string) => {
            terminal.close();
            resolve(answer);
        });
    });
}

export function createJSONDataFile(obj: any) {

    return `// THIS FILE IS AUTO-GENERATED, DO NOT EDIT\n\n` + JSON.stringify(obj, null, "  ");

}

async function updateScripts(): Promise<void> {

    async function updatePackageJSON() {

        // ~ Read and parse Package.json
        const data = await fs.promises.readFile('package.json');
        const content = JSON.parse(data.toString('utf-8'));

        // ~ Update Scripts
        content.scripts.test = "if [ -z $(find src -name '**Test.js') ]; then echo 'No tests'; else yarn run mocha; fi;";
        content.scripts.mocha = "mocha --timeout 20000 --exit **/**/*Test.js"
        content.scripts.eslint = "eslint -c ./.eslintrc.json .";
        content.scripts.eslintfix = "eslint -c ./.eslintrc.json . --fix";
        content.scripts.compile = "tsc";

        // ~ Update Package.Json File
        await fs.promises.writeFile('package.json', JSON.stringify(content, null, 2));

    }

    await updatePackageJSON();

    // ~ copy over other files
    await fs.promises.writeFile('.eslintrc.json', createJSONDataFile(ESLint.createV0()));
    await fs.promises.writeFile('tsconfig.json', createJSONDataFile(TSConfig.createV0()));

}

async function createNewModule(): Promise<void> {

    const packageName: string = await getUserInput("Package Name: ");
    const packageDescription: string = await getUserInput("Package Description: ");

    await fs.promises.mkdir(`../${packageName}/src`);

    await fs.promises.writeFile('package.json', JSON.stringify(Package.createV0(packageName, packageDescription), null, '  '));

    // now we have to upgrade it so that the logic is shared
    await updateScripts();

    // ~ Return Success Message
    console.log("Package Created Successfully");

}

async function workFlow(): Promise<void> {

    // ~ Extract Cli Flags
    const cliargs: Array<string> = process.argv.slice(2);

    // ~ Incase of update only (--update)
    if (cliargs.length === 1 && cliargs[0] === '--update') {
        await updateScripts();
    } else if (cliargs.length === 0) {
        // ~ Incase of just create (no cli flags)
        await createNewModule();
    } else {
        // ~ any other incorrect flag
        console.error('Incorrect args: ', cliargs);
        process.exit(1);
    }

}

workFlow()
    .catch(err => console.error("ERROR: Unable to create module: ", err));

// * ...................................................................................................
// * ..                                                                                               ..
// * ..                                     Imports                                                   ..
// * ..                                                                                               ..
// * ...................................................................................................
import fs from 'fs';
import {Karma} from "./Karma";
import {ESLint} from "./ESLint";
import {Package} from "./Package";
import cliSelect from "cli-select";
import {TSConfig} from "./TSConfig";
import * as readline from 'readline';
import {ICreateModuleConfig, IPackageManifest} from './Interfaces';
import {Files} from "polar-shared/src/util/Files";

// ! ...................................................................................................
// ! ..                                                                                               ..
// ! ..                                     Script Start                                              ..
// ! ..                                                                                               ..
// ! ...................................................................................................

/**
 * ! Entry Point
 */
workFlow().catch(err => console.error("ERROR: Unable to create module: ", err));

/**
 * ! Create Module Routine
 */
export async function createNewModule(): Promise<void> {
    // $ Prepare Config
    const config: Record<string, unknown> = {};

    // $ Capture & Transform User Input
    const packageName: string = await getUserInput("Package Name: ");
    const packageDescription: string = await getUserInput("Package Description: ");
    const NeedTS = await selectFromCli("Will the package have Typescript files ?", ["Yes", "No"]);
    if (NeedTS === "Yes") {
        config.Typescript = true;
        const NeedTests = await selectFromCli("Will the package have Test Files ?", ["No", "Mocha", "Mocha + Karma"]);
        if(NeedTests === "No") { config.Mocha = false; config.Karma = false; }
        if(NeedTests === "Mocha") { config.Mocha = true; config.Karma = false; }
        if(NeedTests === "Mocha + Karma") { config.Mocha = true; config.Karma = true; }
    }
    if(NeedTS === "No") { config.Typescript = false; config.Mocha = false; config.Karma = false; }

    // $ Create Folders and Files
    await fs.promises.mkdir(`../${packageName}`);
    await fs.promises.mkdir(`../${packageName}/src`);
    await fs.promises.writeFile(`../${packageName}/package.json`, JSON.stringify(Package.create(packageName, packageDescription), null, 2));
    await fs.promises.writeFile(`../${packageName}/module-config.json`, JSON.stringify(config, null, 2));

    // $ Read & Update Package.json Template with proper config arguments
    const data = await readPackageJson(`../${packageName}/package.json`);
    const pkg = await UpdatePackageJson(config, data);
    await fs.promises.writeFile(`../${packageName}/package.json`, JSON.stringify(pkg, null, 2));

    // $ Create Remaining Files
    if(config.Typescript) {
        await fs.promises.writeFile(`../${packageName}/.eslintrc.json`, createJSONDataFile(ESLint.create()));
        await fs.promises.writeFile(`../${packageName}/tsconfig.json`, createJSONDataFile(TSConfig.create()));

    }
    if(config.Karma) {
        await fs.promises.writeFile(`../${packageName}/karma.conf.js`, Karma.create());
    }

    // $ Return Success Message
    console.log("Package Created Successfully");
}

/**
 * ! Update Module Routine
 */
export async function updateModules(): Promise<void> {

    // $ Read Package.json & module-config.json
    const config = await readCreateModuleConfig();
    const data = await readPackageJson("package.json");

    // $ Update Package.json
    const pkg = await UpdatePackageJson(config, data);
    await fs.promises.writeFile('package.json', JSON.stringify(pkg, null, 2));

    // $ Update TS/ESlint Files
    if (config.Typescript) {
        await fs.promises.writeFile('.eslintrc.json', createJSONDataFile(ESLint.create()));
        await fs.promises.writeFile('tsconfig.json', createJSONDataFile(TSConfig.create()));

    } else {
        await Files.deleteAsync('.eslintrc.json');
        await Files.deleteAsync('tsconfig.json');

    }

    // $ Update Karma Files
    if (config.Karma) {
        await fs.promises.writeFile('karma.conf.js', Karma.create());
    } else {
        await Files.deleteAsync('karma.conf.js');
    }

    // $ Delete Tslint if it exists
    if (fs.existsSync('tslint.yaml')) {
        await fs.promises.rm('tslint.yaml');
    }

}



// ? ...................................................................................................
// ? ..                                                                                               ..
// ? ..                                     Helper Functions                                          ..
// ? ..                                                                                               ..
// ? ...................................................................................................

/**
 * ? Terminal helper function to capture User's input
 */
export async function getUserInput(property: string): Promise<string> {
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

/**
 * ? Helper function to push answers and capture selection from user
 */
export async function selectFromCli(question: string, answers: Array<string>) {

    console.log(question);

    return await cliSelect({ values: answers, indentation: 1 })
    .then((response) => { return response.value; })
    .catch((err) => { return err });
}

/**
 * ? Helper Functions to Create any
 * ! NON-EDITABLE
 * ? Json files in the new package
 */
export function createJSONDataFile(obj: Record<string, unknown>) {
    return `// THIS FILE IS AUTO-GENERATED, DO NOT EDIT\n` + JSON.stringify(obj, null, 2);
}

/**
 * ? Helper function to Update based on the requirements of certain packages
 */
export async function readCreateModuleConfig(): Promise<ICreateModuleConfig> {

    const path = "module-config.json";

    if (await Files.existsAsync(path)) {
        const buff = await Files.readFileAsync(path)
        return JSON.parse(buff.toString('utf-8'));
    }

    return {};
}

/**
 * ? Read Json File
 */
export async function readPackageJson(path: string){
    const data = await fs.promises.readFile(path);
    const pkg: IPackageManifest = JSON.parse(data.toString('utf-8'));
    return pkg;
}

/**
 * ? Create or Update Package.json
 */
export async function UpdatePackageJson(config: ICreateModuleConfig, pkg: IPackageManifest): Promise<IPackageManifest> {

    // * it's possible that there aren't any scripts or devDependencies.
    if (! pkg.scripts) { pkg.scripts = {}; }
    if (! pkg.devDependencies) { pkg.devDependencies = {}; }

    // * if typescript is enabled for this module
    if (config.Typescript) {
        pkg.scripts.eslint = "eslint -c ./.eslintrc.json . --no-error-on-unmatched-pattern";
        pkg.scripts.eslintfix = "eslint -c ./.eslintrc.json . --fix";
        pkg.scripts.cieslint = "eslint -c ./.eslintrc.json -f compact . --no-error-on-unmatched-pattern";
        pkg.scripts.compile = "RESULT=\"$(find . -name '*.ts' -o -name '*.tsx' -not -path './node_modules/*' -not -name '*.d.ts*')\" && if [ -z \"$RESULT\" ]; then echo 'Nothing to Compile'; else yarn run tsc; fi;";
        pkg.scripts.tsc = 'tsc';
        pkg.scripts.watch = "RESULT=\"$(find . -name '*.ts' -o -name '*.tsx' -not -path './node_modules/*' -not -name '*.d.ts*')\" && if [ -z \"$RESULT\" ]; then echo 'Nothing to Compile'; else yarn run tscwatch; fi;";
        pkg.scripts.tscwatch = 'tsc --watch';

        pkg.devDependencies['polar-eslint'] = `${pkg.version}`;
        pkg.devDependencies['polar-typescript'] = `${pkg.version}`;

        if (config.Mocha) {
            pkg.scripts.test = "RESULT=\"$(find . -name '**Test.js' -o -name '**TestN.js' -o -name '**TestNK.js' -not -path 'node_modules/*')\" && if [ -z \"$RESULT\" ]; then echo 'No tests'; else yarn run mocha; fi;";
            pkg.scripts.mocha = "mocha -p --jobs=1 --timeout 60000 --exit './{,!(node_modules)/**}/*Test.js' './{,!(node_modules)/**}/*TestN.js' './{,!(node_modules)/**}/*TestNK.js'";
            pkg.scripts.citest = "RESULT=\"$(find . -name '**Test.js' -o -name '**TestN.js' -o -name '**TestNK.js' -not -path 'node_modules/*')\" && if [ -z \"$RESULT\" ]; then echo 'No tests'; else yarn run mocha; fi;";
            pkg.scripts.cimocha = "mocha -p --reporter xunit --reporter-option output=test_results.xml --jobs=1 --timeout 60000 --exit './{,!(node_modules)/**}/*Test.js' './{,!(node_modules)/**}/*TestN.js' './{,!(node_modules)/**}/*TestNK.js'";
        }

        if (config.Karma) {
            pkg.scripts.karma = "RESULT=\"$(find . -name '**Test.js' -o -name '**TestK.js' -o -name '**TestNK.js' -not -path 'node_modules/*')\" && if [ -z \"$RESULT\" ]; then echo 'No tests'; else timeout 5m npx karma start; fi;";
            pkg.devDependencies['polar-karma'] = `${pkg.version}`;
            pkg.devDependencies['polar-webpack'] = `${pkg.version}`;
        }

    } else {
        delete pkg.scripts.eslint;
        delete pkg.scripts.eslintfix;
        delete pkg.scripts.compile;
        delete pkg.scripts.tsc;
        delete pkg.scripts.watch;
        delete pkg.scripts.tscwatch;
        delete pkg.scripts.test;
        delete pkg.scripts.mocha;
        delete pkg.scripts.citest;
        delete pkg.scripts.cimocha;
        delete pkg.scripts.karma;

        delete pkg.devDependencies['polar-eslint'];
        delete pkg.devDependencies['polar-typescript'];
        delete pkg.devDependencies['polar-karma'];
        delete pkg.devDependencies['polar-webpack'];
    }
    return pkg;
}

/**
 * ? Start Workflow based on CLI Args
 */
export async function workFlow(): Promise<void> {

    // $ Extract Cli Args
    const cliargs: Array<string> = process.argv.slice(2);

    // $ Start flow based on Args
    if (cliargs.length === 1 && cliargs[0] === '--update') {
        await updateModules();
    } else if (cliargs.length === 0) {
        await createNewModule();
    } else {
        console.error('Incorrect args: ', cliargs);
        process.exit(1);
    }
}

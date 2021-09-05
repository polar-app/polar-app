import fs from 'fs';
import * as readline from 'readline';

// & Interfaces
interface PackageJson {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    scripts?: Scripts;
    devdependencies?: Record<string, unknown>;
}
interface Scripts {
    test?: string;
    mocha?: string;
    eslint?: string;
    eslintfix: string;
    compile?: string;
}

// ? Helper Functions
/**
 * readFile
 * @param name string
 * @returns JSON
 */
function readFile(name: string): PackageJson {
    const data: Buffer = fs.readFileSync(name);
    return JSON.parse(data.toString('utf-8'));
}

/**
 * getUserInput
 * @param name string
 * @returns string
 */
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

/**
 * updateScripts
 * @returns void
 */
async function updateScripts(): Promise<void> {
    // ~ Read and parse Package.json
    const data = await fs.promises.readFile('package.json');
    const content = JSON.parse(data.toString('utf-8'));

    // ~ Update Scripts
    content.scripts.test = "if [ -z $(find . -name '**Test.js') ]; then echo 'No Tests Found!!'; else yarn run mocha; fi;";
    content.scripts.mocha = "mocha --timeout 20000 --exit **/**/*Test.js"
    content.scripts.eslint = "eslint -c ./.eslintrc.json .";
    content.scripts.eslintfix = "eslint -c ./.eslintrc.json . --fix";
    content.scripts.compile = "tsc";

    // ~ Update Package.Json File
    await fs.promises.writeFile('package.json', JSON.stringify(content, null, 2));

    // ~ copy over other files
    await fs.promises.copyFile('/polar-app/packages/polar-app-public/polar-create-module/.eslintrc.json', './.eslintrc.json');
    await fs.promises.copyFile('/polar-app/packages/polar-app-public/polar-create-module/tsconfig.json', './tsconfig.json');
}

/**
 * createNewModule
 * @returns Promise<void>
 */
 async function createNewModule(): Promise<void> {
    // ~ Get user input
    const packageName: string = await getUserInput("Package Name: ");
    const packageDescription: string = await getUserInput("Package Description: ");

    // ~ Check if package Already Exists
    if(fs.existsSync(`../${packageName}`)) { 
        console.log("Package Already Exists");
        return;
    }

    // ~ Extract file contents
    const packageJsonFile: PackageJson = readFile('package.json');

    // ~ Apply User Input to Package.json
    packageJsonFile.name = packageName;
    packageJsonFile.description = packageDescription;

    // ~ Create Directory & Copy Over files
    await fs.promises.mkdir(`../${packageName}`);
    await fs.promises.mkdir(`../${packageName}/src`);
    await fs.promises.writeFile(`../${packageName}/package.json`, JSON.stringify(packageJsonFile, null, 2));
    await fs.promises.copyFile('./tsconfig.json', `../${packageName}/tsconfig.json`);
    await fs.promises.copyFile('./.eslintrc.json', `../${packageName}/.eslintrc.json`);
    

    // ~ Return Success Message
    console.log("Package Created Successfully");
}

// ! Workflow
async function workFlow(): Promise<void> {
    // ~ Extract Cli Flags
    const cliargs: Array<string> = process.argv.slice(2);

    // ~ Incase of update only (--update)
    if (cliargs.length === 1 && cliargs[0] === '--update') { await updateScripts(); }

    // ~ Incase of just create (no cli flags)
    else if (cliargs.length === 0) { await createNewModule(); }
    
    // ~ any other incorrect flag
    else { console.log('Sorry Wrong Flag !!'); }

}

export default workFlow();

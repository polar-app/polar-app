import { existsSync } from 'fs';
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
    devdependencies?: object;
}
interface Scripts {
    test?: string;
    eslint: string;
    compile: string;
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
        let terminal: readline.Interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        terminal.question(property, (answer: string) => {
            terminal.close();
            resolve(answer);
        });
    }); 
}

async function updateScripts() {
    let packagej : PackageJson = readFile('package.json');
    console.log(packagej.scripts?.eslint);
}

// ! Workflow
/**
 * @returns void
 */
async function createNewModule(): Promise<void> {
    updateScripts();
    // console.log(process.argv.slice(2).pop());
    // // ~ Get user input
    // const packageName = await getUserInput("Package Name: ");
    // const packageDescription = await getUserInput("Package Description: ");

    // // ~ Check if package Already Exists
    // if(fs.existsSync(`../${packageName}`)) { 
    //     console.log("Package Already Exists");
    //     return;
    // }

    // // ~ Extract file contents
    // const packageJsonFile = readFile('package.json');
    // const tsconfig = readFile('tsconfig.json');

    // // ~ Apply User Input to Package.json
    // packageJsonFile.name = packageName;
    // packageJsonFile.description = packageDescription;

    // // ~ Stringfy File data to write
    // let packageFile = JSON.stringify(packageJsonFile, null, 2);
    // let tsconfigFile = JSON.stringify(tsconfig, null, 2);

    // // ~ Create Directory & Copy Over files
    // await fs.promises.mkdir(`../${packageName}`);
    // await fs.promises.mkdir(`../${packageName}/src`);
    // await fs.promises.writeFile(`../${packageName}/package.json`, packageFile);
    // await fs.promises.writeFile(`../${packageName}/tsconfig.json`, tsconfigFile);

    // // ~ Return Success Message
    // console.log("Package Created Successfully");
}


export default createNewModule();
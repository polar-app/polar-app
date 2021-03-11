import fs from 'fs';
import path from 'path';

function indent(data: string,
                spacing: string = '    ') {

    return data.split("\n").map(current => spacing +  current ).join("\n");

}

function handleIncludes() {

    const files = fs.readdirSync(path.join(__dirname, 'includes')).sort();

    let result: string = '';

    for (const file of files) {

        const filePath = path.join(__dirname, 'includes', file);
        const data = fs.readFileSync(filePath);
        const content = data.toString('utf-8');
        result += indent(content);

    }

    return result;

}

function handleCollections() {

    const files = fs.readdirSync(path.join(__dirname, 'collections')).sort();

    let result: string = '';

    for (const file of files) {

        const collectionName = file.replace(".txt", "");

        const filePath = path.join(__dirname, 'collections', file);
        const data = fs.readFileSync(filePath);
        const content = data.toString('utf-8');

        const matchBlock =
            `\nmatch /${collectionName}/{document=**} {\n` +
            indent(content) + "\n" +
            '}\n';

        result += indent(matchBlock);

    }

    return result;

}

console.log("// AUTOGENERATED. DO NOT EDIT MANUALLY\n");

console.log('service cloud.firestore {');
console.log('  match /databases/{database}/documents {');

console.log(handleIncludes());
console.log(handleCollections());

console.log('  }');
console.log('}');

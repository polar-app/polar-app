const fs = require('fs');

main();

function main() {
    const data = readPackageJson("package.json");
    let pkg = {}
    pkg[data.name] = {};
    pkg[data.name].dependencies = data.dependencies;
    pkg[data.name].devDependencies = data.devDependencies;
    console.log(JSON.stringify(pkg));
}

function readPackageJson(path) {
    const data = fs.readFileSync(path);
    const pkg = JSON.parse(data.toString('utf-8'));
    return pkg;
}
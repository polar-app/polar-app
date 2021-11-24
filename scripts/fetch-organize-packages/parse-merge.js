const fs = require('fs');

const file = fs.readFileSync('module-package-output.json');
const data = file.toString('utf-8').split('\n');

// ! Remove last empty element
data.pop();

// ? New Unifed Object
let newData = {};

data.forEach(module => {
    module = JSON.parse(module);
    const name = Object.keys(module)[0];
    newData[name] = {};
    newData[name].dependencies = module[name].dependencies;
    newData[name].devDependencies = module[name].devDependencies;
});

newData = Object.keys(newData).sort().reduce((r, k) => (r[k] = newData[k], r), {})
fs.writeFileSync('module-package-output.json', JSON.stringify(newData, null, 2));
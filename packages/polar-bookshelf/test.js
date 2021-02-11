const fs = require('fs');

const data = fs.readFileSync("users.csv");
const content = data.toString('utf-8');

const lines = content.split("\n");

for (const line of lines) {
    const fields = line.split(",");
    const creation = fields[23];

    if (creation === '' || creation === undefined) {
        continue;
    }
    //
    // console.log(creation);
    const date = new Date(parseInt(creation)).toISOString();
    console.log(date);

}

// console.log(data);

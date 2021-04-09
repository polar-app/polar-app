const fs = require("fs");

const content = fs.readFileSync("users.json");

const data = JSON.parse(content);

const users = data.users.sort((a, b) => a.createdAt - b.createdAt);

for (const user of users) {
    const createdAt = new Date(Math.floor(user.createdAt));
    const displayName = user.displayName;
    const email = user.email;
    const nameParts = displayName.split(" ")

    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    const record = `${email},${firstName},${lastName}`;

    console.log(record);

}

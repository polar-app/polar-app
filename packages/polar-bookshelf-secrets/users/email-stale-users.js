const fs = require("fs");

const content = fs.readFileSync("users.json");

const data = JSON.parse(content);

let users = data.users.sort((a, b) => a.createdAt - b.createdAt);

const now = Date.now();

const rangeStart = now - 60 * 24 * 60 * 60 * 1000;
const rangeEnd = now - 30 * 24 * 60 * 60 * 1000;

users = users.filter(current => current.createdAt >= rangeStart)
             .filter(current => current.lastSignedInAt >= rangeStart && current.lastSignedInAt <= rangeEnd)

console.log({rangeStart, rangeEnd});

for (const user of users) {
    console.log("====")
    console.log(user.email);
    console.log(user.createdAt);
}


console.log("<pre>")

for (const user of users) {
    const createdAt = new Date(Math.floor(user.createdAt));
    const displayName = user.displayName;
    const email = user.email;
    const firstName = displayName.split(" ")[0];

    const subject = `Hey ${firstName}, Why'd you stop using Polar?`;

    const body =
        `
Hey ${firstName},

I'm Kevin, the creator of Polar.

I'm curious why you stopped using Polar.  

It's a project I'm VERY passionate about so your feedback could literally save 
me hundreds of hours of work.

Could you take 30 seconds and just let me know what you didn't like about it?

This is my direct email so you can just reply or use the form below:

https://kevinburton1.typeform.com/to/x9f5z0 

Thanks!

Kevin`;

    const params = {
        subject: encodeURIComponent(subject),
        body: encodeURIComponent(body)
    };

    const record = `<a href=mailto:${email}?subject=${params.subject}&body=${params.body}>${createdAt.toISOString()}: ${email}</a>`;

    console.log(record);

}

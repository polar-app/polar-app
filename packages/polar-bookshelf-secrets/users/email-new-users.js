const fs = require("fs");

const content = fs.readFileSync("users.json");

const data = JSON.parse(content);

const users = data.users.sort((a, b) => a.createdAt - b.createdAt);

console.log("<pre>")

for (const user of users) {
    const createdAt = new Date(Math.floor(user.createdAt));
    const displayName = user.displayName;
    const email = user.email;
    const firstName = displayName.split(" ")[0];

    const subject = `${firstName}, how do you like Polar so far?`;

    const body =
        `
Hey ${firstName},

I'm Kevin, the creator of Polar.

I try to send new users a personal email to see what they're thinking of Polar and if they have any feedback on how to improve it.

Honestly ALL feedback is seriously appreciated!

Love it or hate it ... honestly.  I collect all the feedback and use it to improve future versions of the app.

Thanks!

Kevin`;

    const params = {
        subject: encodeURIComponent(subject),
        body: encodeURIComponent(body)
    };

    const record = `<a href=mailto:${email}?subject=${params.subject}&body=${params.body}>${createdAt.toISOString()}: ${email}</a>`;

    console.log(record);

}

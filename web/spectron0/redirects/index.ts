import {app, net} from "electron";

app.on('ready', async () => {

    // // https://electronjs.org/docs/api/net
    // const req = net.request({});
    //
    // req.on('data', data => console.log(data));
    //
    // console.log("READY");

    const url = "https://github.com/burtonator/polar-bookshelf/releases/download/v1.80.3/latest-mac.yml";
    // const url = "https://github.com/burtonator/polar-bookshelf/releases/download/v1.80.3/Polar-Bookshelf-1.80.3-mac.zip";
    // const url = "https://github.com/burtonator/polar-bookshelf/releases/download/v1.80.3/Polar-Bookshelf-1.80.3.dmg";
    // const url = "https://github.com/burtonator/polar-bookshelf/releases/download/v1.80.3/Polar-Bookshelf-1.80.3.dmg.blockmap";

    const request = net.request({url, redirect: 'follow'});
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
            console.log("got chunk");
        })
        response.on('end', () => {
            console.log('No more data in response.');
        });
    });
    request.end();

});


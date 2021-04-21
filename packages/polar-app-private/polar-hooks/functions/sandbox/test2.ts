import * as https from "https";


// we can change the request URL so that it's handled by the proper target.
const url = 'https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/stash%2F12RMNjmX1PLwqN5fRXzh89Yi7tbL24e5VfCNs4Nq.pdf?alt=media&token=0a2708be-ef63-4791-a338-a3c887b73b19';

// This script works and I get a bunch of GOT DATA followed by a GOT END

https.get(url, (dataResponse) => {

    let idx: number = 0;

    dataResponse.on("data", data => {
        console.log(`FIXME: got data(${data.length}): ` + idx++);
    });

    dataResponse.on("end", () => {
        console.log("GOT END");
    });

    dataResponse.on("error", (err) => {
        console.log("GOT ERROR");
    });

});

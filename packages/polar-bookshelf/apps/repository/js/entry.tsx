import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";
import {Repository} from "../../../web/js/apps/repository/Repository";

// need to start the ConsoleRecorder as soon as possible so that we capture even
// when libraries are being imported
ConsoleRecorder.init();

async function start() {

    console.log("Starting logging init");
    console.log("Starting logging init... done");

    await new Repository().start();

}

start()
    .catch(err => console.error("Could not start repository app: ", err));



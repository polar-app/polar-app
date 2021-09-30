import {LoginApp} from "./ui/login/LoginApp";
import {Karma} from "./Karma";

export function startApp() {
    console.log("Starting react app...");
    LoginApp.start();
    console.log("Starting react app...done");
}

document.addEventListener("DOMContentLoaded", () => {

    if (! Karma.isKarma()) {
        startApp();
    }

});

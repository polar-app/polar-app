import firebase from "firebase";
import "firebase/auth";

describe("InitializeTest", function() {

    it("basic", () => {

        const config = {
            apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
            authDomain: "polar-32b0f.firebaseapp.com",
            databaseURL: "https://polar-32b0f.firebaseio.com",
            projectId: "polar-32b0f",
            storageBucket: "polar-32b0f.appspot.com",
            messagingSenderId: "919499255851",
            // timestampsInSnapshots: true
        };
        const app = firebase.initializeApp(config);
        const auth = firebase.auth(app);

    });


})

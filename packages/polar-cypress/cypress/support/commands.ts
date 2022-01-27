// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// https://github.com/cypress-io/cypress/issues/1208

// import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

Cypress.Commands.add('clearIndexedDB', async () => {
    const databases = await window.indexedDB.databases();

    // TODO: this could probably be a bit cleaner whereby we map over a function
    // that returns a promise and then Promise.all so it's parallel but also a
    // bit more readable and less prone to error.

    await Promise.all(
        databases.map(
            ({name}) =>
                new Promise((resolve, reject) => {
                    const request = window.indexedDB.deleteDatabase(name);

                    request.addEventListener('success', resolve);
                    // Note: we need to also listen to the "blocked" event
                    // (and resolve the promise) due to https://stackoverflow.com/a/35141818
                    request.addEventListener('blocked', resolve);
                    request.addEventListener('error', reject);
                }),
        ),
    );
});

Cypress.Commands.add('purgeFirebaseUser', async (email: string) => {
    //
    // const firebase = FirebaseAdmin.app();
    // const auth = firebase.auth();
    //
    // try {
    //
    //     const user = await auth.getUserByEmail(email);
    //     await auth.deleteUser(user.uid);
    //
    //     // TODO: also wipe out the user data.. .
    //
    // } catch (e) {
    //
    //     if (e.code === 'auth/user-not-found') {
    //         // we're done as this user isn't in the database
    //         return;
    //     }
    //
    //     throw e;
    //
    // }

});

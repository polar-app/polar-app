import {CONFIG_TEST, Firebase} from "./Firebase";

async function createUserWhenAbsent(email: string, pass: string) {

    const auth = app.auth();

    const hasUser = async () => {

        try {
            await auth.getUserByEmail(email);
            return true;
        } catch (e) {

            if (e.code === 'auth/user-not-found') {
                return false;
            }
            throw e;
        }

    };

    const createUser = async () => {

        await auth.createUser({
            email,
            emailVerified: false,
            // phoneNumber: '+11234567890',
            password: pass,
            displayName: 'John Doe',
            disabled: false
        });

    };

    if (await hasUser()) {
        console.log("already exists");
        return;
    }

    await createUser();

    console.log("created");

}

async function createUsers() {

    const password = "mk9z79vlquixvqd";
    await createUserWhenAbsent('getpolarized.test+test3@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test4@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test5@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test6@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test7@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test8@gmail.com', password);
    await createUserWhenAbsent('getpolarized.test+test9@gmail.com', password);

}

// let app = Firebase.getApp(CONFIG_MAIN);
//
// createUsers()
//     .catch(err => console.error(err));

let app = Firebase.getApp(CONFIG_TEST);

createUsers()
    .catch(err => console.error(err));

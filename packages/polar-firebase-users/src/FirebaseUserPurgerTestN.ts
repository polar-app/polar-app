import { FirebaseUserCreator } from "./FirebaseUserCreator";
import { FirebaseUserPurger } from "./FirebaseUserPurger";

xdescribe("FirebaseUserPurger", () => {
    xit("basic", async () => {
        const user = await FirebaseUserCreator.createTestUser();

        await FirebaseUserPurger.doPurge(user.uid);
    });
})
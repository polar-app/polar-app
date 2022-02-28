import { FirebaseUserCreator } from "./FirebaseUserCreator";
import { FirebaseUserPurger } from "./FirebaseUserPurger";

describe("FirebaseUserPurger", () => {
    it("basic", async () => {
        const user = await FirebaseUserCreator.createTestUser({});

        await FirebaseUserPurger.doPurge(user.uid);
    });
})

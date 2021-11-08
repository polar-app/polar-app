import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {WaitingUsers} from "polar-private-beta/src/WaitingUsers";

export const handler = lambdaWrapper(WaitingUsers.getList, {
    authRequired: true,
});

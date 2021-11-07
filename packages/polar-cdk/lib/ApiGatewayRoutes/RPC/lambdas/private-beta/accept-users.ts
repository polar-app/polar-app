import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {UsersAcceptor} from "polar-private-beta/src/UsersAcceptor";

export const handler = lambdaWrapper(UsersAcceptor.exec, {
    authRequired: true,
});

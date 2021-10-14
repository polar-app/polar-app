import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {BatchAcceptor} from "polar-private-beta/src/BatchAcceptor";

export const handler = lambdaWrapper(BatchAcceptor.exec, {
    authRequired: true,
});

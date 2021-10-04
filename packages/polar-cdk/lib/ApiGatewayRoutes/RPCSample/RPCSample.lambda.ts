import {FuncWithAuth, lambdaWrapper} from "../../shared/lambdaWrapper";

const originalHandler: FuncWithAuth = (idUser, request) => {
    return {
        success: true,
        idUser,
        request,
    }
};

export const handler = lambdaWrapper(originalHandler, {
    authRequired: true,
});

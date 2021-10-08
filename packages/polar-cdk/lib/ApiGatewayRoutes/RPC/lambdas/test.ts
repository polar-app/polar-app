import {FuncWithAuth, lambdaWrapper} from "../../../shared/lambdaWrapper";

// The original implementation. This is runtime-agnostic,
// meaning that it can be ran inside AWS Lambda OR Firebase Functions
const originalHandler: FuncWithAuth<void, unknown> = async (idUser, request) => {
    return {
        success: true,
        idUser,
        request,
    }
};

// Export the Lambda to the Runtime
export const handler = lambdaWrapper<void, unknown>(originalHandler);

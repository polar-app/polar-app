import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {RegisterForPrivateBeta} from "polar-private-beta/src/RegisterForPrivateBeta";
import {IRegisterForPrivateBetaRequest} from "polar-private-beta-api/src/IRegisterForPrivateBetaRequest";
import {
    IRegisterForPrivateBetaError,
    IRegisterForPrivateBetaResponse
} from "polar-private-beta-api/src/IRegisterForPrivateBetaResponse";

export const handler = lambdaWrapper<IRegisterForPrivateBetaRequest, IRegisterForPrivateBetaResponse | IRegisterForPrivateBetaError>(RegisterForPrivateBeta.exec, {
    authRequired: false,
});

import {ExpressFunctions} from "../util/ExpressFunctions";
import {BlockPermissionFunctions} from "./BlockPermissionFunctions";

export const BlockPermissionFunction = ExpressFunctions.createRPCHook('BlockPermissionFunction', BlockPermissionFunctions.exec);

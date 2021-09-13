import {ExpressFunctions} from "../util/ExpressFunctions";
import {NSpaceCreateFunctions} from "./NSpaceCreateFunctions";

export const NSpaceCreateFunction = ExpressFunctions.createRPCHook('NSpaceCreateFunction', NSpaceCreateFunctions.exec);

import {ExpressFunctions} from "../util/ExpressFunctions";
import {AutoFlashcardFunctions} from "./AutoFlashcardFunctions";

export const AutoFlashcardFunction = ExpressFunctions.createRPCHook(AutoFlashcardFunctions.exec);


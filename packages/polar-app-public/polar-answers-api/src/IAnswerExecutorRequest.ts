import {UserIDStr} from "polar-shared/src/util/Strings";
import {AIModel} from "./AIModel";


export interface IAnswerExecutorRequest {
    readonly uid: UserIDStr;
    readonly question: string;
    readonly search_model?: AIModel;
    readonly model?: AIModel;
}

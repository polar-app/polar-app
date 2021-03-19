import {SetArrays} from "polar-shared/src/util/SetArrays";

export class ModelNames {

    public static verifyRequired(modelNames: ReadonlyArray<string>) {

        const requiredModelNames = ["Cloze", "Basic"];

        return SetArrays.difference(requiredModelNames, modelNames);

    }

}


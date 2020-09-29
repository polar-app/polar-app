import {AbstractDocAnnotationsDelegate} from "./AbstractDocAnnotationsDelegate";
import {BaseDocAnnotation} from "./BaseDocAnnotations";
import {ProfileHandleStr, ProfileIDStr} from "../Profiles";
import {WriteBatch} from "@google-cloud/firestore";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";


export class ProfileDocAnnotations {

    private static delegate = new AbstractDocAnnotationsDelegate('profile_doc_annotation', 'profileID');

    public static createID(profileID: ProfileIDStr, id: IDStr) {
        return Hashcodes.create({profileID, id});

    }

    public static convert(profileID: ProfileIDStr, record: BaseDocAnnotation): ProfileDocAnnotation {
        const id = this.createID(profileID, record.id);
        return {...record, id, profileID};
    }

    public static list(parent: string): Promise<ReadonlyArray<ProfileDocAnnotation>> {
        return this.delegate.list(parent);
    }

    public static write(batch: WriteBatch,
                        record: ProfileDocAnnotation) {

        this.delegate.write(batch, record);

    }

    public static delete(batch: WriteBatch, id: IDStr) {
        this.delegate.delete(batch, id);
    }

}

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}

import * as functions from 'firebase-functions';
import {Firestore} from "../util/Firestore";
import {DocAnnotations} from "./db/doc_annotations/DocAnnotations";
import {ProfileDocAnnotation, ProfileDocAnnotations} from "./db/doc_annotations/ProfileDocAnnotation";
import {GroupDocAnnotation, GroupDocAnnotations} from "./db/doc_annotations/GroupDocAnnotations";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";


// TODO: we have to migrate the code from DocMeta to this so that we have the interfaces on the backend.  This
// is a BIG task though as a lot of code needs to move over.. to polar-shared

export const GroupDocMetaWriteFunction
    = functions.firestore.document('/doc_meta/{document=**}')
        .onWrite(async (change, context) => {

    const firestore = Firestore.getInstance();
    const batch = firestore.batch();

    const docAnnotations = await DocAnnotations.computeDocAnnotationMutations(change.before, change.after);

    console.log("Handling N annotations: " + docAnnotations.length);

    for (let docAnnotation of docAnnotations) {

        // make it so that we only have defined properties otherwise we can't write.
        docAnnotation = Dictionaries.onlyDefinedProperties(docAnnotation);

        switch (docAnnotation.collection) {

            case "profile_doc_annotation":

                switch (docAnnotation.type) {
                    case "set":
                        ProfileDocAnnotations.write(batch, <ProfileDocAnnotation> docAnnotation.value);
                        break;
                    case "delete":
                        ProfileDocAnnotations.delete(batch, docAnnotation.value.id);
                        break;
                }

                break;

            case "group_doc_annotation":

                switch (docAnnotation.type) {
                    case "set":
                        GroupDocAnnotations.write(batch, <GroupDocAnnotation> docAnnotation.value);
                        break;
                    case "delete":
                        GroupDocAnnotations.delete(batch, docAnnotation.value.id);
                        break;
                }

                break;

        }

    }

    await batch.commit();

});


import {Change, EventContext} from "firebase-functions";
import {firestore} from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;

const EPUBThumbnailer = require('polar-epub/src/EPUBThumbnailer');
const functions = require('firebase-functions');

export const ThumbnailGenerationRequested = functions.firestore
    .document('thumbnail_regenerate_requests/{docId}')
    .onWrite((change: Change<DocumentSnapshot>, context: EventContext) => {
        console.log('Thumbnail regeneration requested', change.after);

        EPUBThumbnailer.generate({
            pathOrURL: '',
            scaleBy: 'width',
            value: 300
        }).then(() => {
            console.log('resolved');
        })
    });

import { SpacedRepCollection } from "polar-firebase/src/firebase/om/SpacedRepCollection";
import { SpacedRepStatCollection } from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
// import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import { FirestoreLike } from "polar-firestore-like/src/Collections";
import { isPresent } from "polar-shared/src/Preconditions";
import { DocPreviewCollection } from "polar-firebase/src/firebase/om/DocPreviewCollection";
import { HeartbeatCollection } from "polar-firebase/src/firebase/om/HeartbeatCollection";
import { IFirestoreClient } from "polar-firestore-like/src/IFirestore";
import { FirestoreBrowserClient } from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export class FirestoreCollections {
  public static async configure(firestore?: IFirestoreClient) {
    firestore = firestore || (await FirestoreBrowserClient.getInstance());

    // TODO: try to migrate firebaseProvider to async as all the functions
    // should be async...

    for (const firestoreBacked of [
      SpacedRepCollection,
      SpacedRepStatCollection,
      DocPreviewCollection,
      HeartbeatCollection,
    ]) {
      if (isPresent(firestoreBacked.firestoreProvider)) {
        // already configured
        continue;
      }

      firestoreBacked.firestoreProvider = () =>
        firestore as any as FirestoreLike;
    }
  }
}

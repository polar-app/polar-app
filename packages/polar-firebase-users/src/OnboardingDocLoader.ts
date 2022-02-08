import {IDStr} from "polar-shared/src/util/Strings";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {InputSources} from "polar-shared/src/util/input/InputSources";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

// @TODO Plug this into FirebaseUserCreator.ts as a last step
export namespace OnboardingDocLoader {

    // @TODO this should be "loosely" based on the logic inside packages/polar-bookshelf/web/js/apps/repository/importers/DocImporter.ts
    // @TODO main difference being that the one above executes on the Frontend, but this is in the backend
    export const load = async (email: IDStr) => {
        const url = 'https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/public%2FThe%20Rather%20Average%20Guide%20To%20Using%20Polar.pdf?alt=media&token=113fbead-faf2-40c8-b803-db4454ac7cd7';

        const docMetadata = await PDFMetadata.getMetadata(url);
        const fileHashMeta = await computeHashPrefix(url);
        return {
            docMetadata,
            fileHashMeta,
        }
    }

    async function computeHashPrefix(docPath: string): Promise<{
        readonly hashPrefix: string;
        readonly hashcode: string;
    }> {

        const inputSource = await InputSources.ofValue(docPath);

        const hashcode = await Hashcodes.createFromInputSource(inputSource);
        const hashPrefix = hashcode.substring(0, 10);

        return {hashcode, hashPrefix};

    }
}

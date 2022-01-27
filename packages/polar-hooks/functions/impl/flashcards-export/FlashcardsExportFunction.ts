import {IDUser} from "polar-rpc/src/IDUser";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {AnkiExport} from "./FlashcardsExport";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {File} from "@google-cloud/storage";
import {Lazy} from "polar-shared/src/util/Lazy";
import {Datastores} from "../datastore/Datastores";
import * as fs from "fs";
import {UUIDs} from "polar-shared/src/metadata/UUIDs";
import {FlashcardsExport} from "polar-backend-api/src/api/FlashcardsExport";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

export namespace FlashcardsExportFunctionBackend {
    import FlashcardExportRequest = FlashcardsExport.FlashcardExportRequest;
    import FlashcardExportResponse = FlashcardsExport.FlashcardExportResponse;

    function createFileInTmpBucket(file: string) {
        const project = storageConfig().config.project;
        const bucketName = `gs://tmp-${project}`;
        const bucket = storage().bucket(bucketName);
        return new File(bucket, file);
    }

    async function uploadTmpFileToGcpTempBucket(path: string, storageFile: File) {
        return new Promise<void>((resolve, reject) => {
            const readStream = fs.createReadStream(path);
            const writeStream = storageFile.createWriteStream();

            readStream.pipe(writeStream)
                .on('finish', () => {
                    // Remove temporary file from file system and only leave the GCP bucket version
                    fs.unlinkSync(path);
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
        })
    }

    export async function exec(idUser: IDUser,
                               request: FlashcardExportRequest): Promise<FlashcardExportResponse> {

        const path = await AnkiExport.create(request, idUser.uid);

        const now = ISODateTimeStrings.create();
        const prettyFileName = `${now}-${request.ankiDeckName}.apkg`;
        const uniqueFileName = `${UUIDs.create()}.apkg`;

        const storageFile = createFileInTmpBucket(`flashcard-exports/${uniqueFileName}`);

        await uploadTmpFileToGcpTempBucket(path, storageFile);

        // When the temporary file URL is visited in the browser, force it to download instead of being
        // opened by the native Browser viewer
        await storageFile.setMetadata({contentDisposition: `attachment; filename="${prettyFileName}"`});

        // Make the file publicly downloadable through its link
        await storageFile.makePublic();

        return {
            temporary_url: storageFile.publicUrl(),
        };
    }
}

export const FlashcardsExportFunction = ExpressFunctions.createRPCHook("FlashcardsExportFunction", FlashcardsExportFunctionBackend.exec);

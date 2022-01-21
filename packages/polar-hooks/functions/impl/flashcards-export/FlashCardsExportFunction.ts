import {IDUser} from "polar-rpc/src/IDUser";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {AnkiExport} from "./FlashcardsExport";
import express from "express";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {File} from "@google-cloud/storage";
import {Lazy} from "polar-shared/src/util/Lazy";
import {Datastores} from "../datastore/Datastores";
import * as fs from "fs";
import {UUIDs} from "polar-shared/src/metadata/UUIDs";

export interface FlashcardExportRequest {
    /**
     * an array of flashcard block IDs
     */
    readonly targets: ReadonlyArray<string>;

    /**
     * Generated file name will include this string + apkg extension
     * example: anki_export.apkg
     */
    readonly ankiDeckName: string;
}

export interface FlashCardExportResponse {
    temporary_url: string,
}

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

export namespace FlashCardsExportFunction {
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
                               request: FlashcardExportRequest,
                               response: express.Response
    ): Promise<FlashCardExportResponse> {
        const path = await AnkiExport.create(request, idUser.uid);

        response.download(path);

        const now = ISODateTimeStrings.create();
        const prettyFileName = `${now}-${request.ankiDeckName}.zip`;
        const uniqueFileName = `${UUIDs.create()}.zip`;

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

export const FlashcardsExportFunction = ExpressFunctions.createRPCHookResponse("FlashcardsExportFunction", FlashCardsExportFunction.exec);

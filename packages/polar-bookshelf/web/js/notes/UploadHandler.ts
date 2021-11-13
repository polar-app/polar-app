import React from "react";
import {Backend} from "polar-shared/src/datastore/Backend";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {Images} from "polar-shared/src/util/Images";
import {ProgressTrackerManager, useFirebaseCloudStorage} from "../datastore/FirebaseCloudStorage";
import {useBlocksTreeStore} from "./BlocksTree";
import {IDropTarget} from "./store/BlocksStore";
import {FirebaseDatastoresShared} from "polar-shared-datastore/src/FirebaseDatastoresShared";
import WriteFileProgress = FirebaseDatastoresShared.WriteFileProgress;
import WriteController = FirebaseDatastoresShared.WriteController;

type URLStr = string;

type UploadFileTypes = 'image';

type GenericUploadedFile = {
    type: UploadFileTypes;
    url: URLStr;
};

export type UploadedFile = ImageUploadedFile;

type ImageUploadedFile = GenericUploadedFile & {
    width: number;
    height: number;
};

type ImageUploadFile = {
    type: 'image';
    name: string;
    file: File;
    blobURL: string;
};

type UploadFile = ImageUploadFile;

const getTypeFromMime = (mime: string): UploadFileTypes | 'unknown' => {
    switch (mime) {
        case 'image/webp':
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/avif':
        case 'image/apng':
            return 'image';
    }
    return 'unknown';
};

export const randomizeFileName = (originalFileName: string) => {
    return `${Math.random().toString(36).substring(7)}${originalFileName}`;
};


type IUseUploadHandlerOpts = {
    file: File;
    target: IDropTarget;
};

export const useUploadHandler = (): (opts: IUseUploadHandlerOpts) => Promise<UploadedFile | undefined> => {
    const blocksTreeStore = useBlocksTreeStore();
    const firebaseCloudStorage = useFirebaseCloudStorage();

    return React.useCallback(async ({ file, target: {id, pos} }) => {
        const getUploadFile = (): UploadFile | undefined => {
            const type = getTypeFromMime(file.type);
            switch (type) {
                case 'image':
                    const name = randomizeFileName(file.name);
                    return {
                        file,
                        type,
                        name,
                        blobURL: URL.createObjectURL(file),
                    };
                default:
                    return undefined;
            }
        };

        const uploadFile = getUploadFile();

        if (! uploadFile) {
            return undefined;
        }

        const progressTracker = new ProgressTrackerManager<WriteFileProgress>();

        const cleanup = () => {
            if (['image'].indexOf(uploadFile.type) > -1) {
                URL.revokeObjectURL(uploadFile.blobURL);
            }
            blocksTreeStore.removeInterstitial(id, uploadFile.name);
        };

        switch (uploadFile.type) {
            case 'image':
                const onController = (controller: WriteController) => {
                    blocksTreeStore.addInterstitial(id, {
                        type: 'image',
                        position: pos,
                        id: uploadFile.name,
                        blobURL: uploadFile.blobURL,
                        controller,
                        progressTracker,
                    });
                };

                try {
                    const {url} = await firebaseCloudStorage.writeFile(
                        Backend.IMAGE,
                        { name: uploadFile.name },
                        uploadFile.file,
                        {
                            visibility: Visibility.PUBLIC,
                            progressListener: progressTracker.progressListener,
                            onController,
                        }
                    );

                    const {width, height} = await Images.getDimensions(uploadFile.blobURL);

                    return { url, type: uploadFile.type, width, height };
                } catch (e) {
                    throw new Error(`Failed to upload file ${uploadFile.name}`);
                } finally {
                    cleanup();
                }
        }
    }, [blocksTreeStore, firebaseCloudStorage]);
};

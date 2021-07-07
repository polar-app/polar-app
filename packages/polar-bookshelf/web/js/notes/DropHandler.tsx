import {URLStr} from "polar-shared/src/util/Strings";
import React from "react";
import {useBlocksTreeStore} from "./BlocksTree";
import firebase from 'firebase/app'
import 'firebase/storage';
import {FirebaseDatastores} from "polar-shared/src/datastore/FirebaseDatastores";
import {Backend} from "polar-shared/src/datastore/Backend";
import {useUserInfoContext} from "../apps/repository/auth_handler/UserInfoProvider";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Images} from "polar-shared/src/util/Images";
import {BlockIDStr} from "../../../../polar-app-public/polar-blocks/src/blocks/IBlock";
import {ImageContent} from "./content/ImageContent";

type DropFileType = 'image';

type GenericUploadedFile = {
    type: DropFileType;
    url: URLStr;
};

type UploadedFile = ImageUploadedFile;

type ImageUploadedFile = GenericUploadedFile & {
    width: number;
    height: number;
};

type DropFile = {
    file: File;
    type: DropFileType;
    id: string;
};

const getTypeFromMime = (mime: string): DropFileType | 'unknown' => {
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


export const fileUploader = (dropFile: DropFile): Promise<GenericUploadedFile> => new Promise((resolve, reject) => {
    const storage = firebase.storage();
    const fileRef = storage.ref().child(dropFile.id);
    const uploader = fileRef.put(dropFile.file);
    uploader.on(
        firebase.storage.TaskEvent.STATE_CHANGED
        , NULL_FUNCTION
        , (err: firebase.storage.FirebaseStorageError) => reject(err)
        , () => {
            uploader.snapshot.ref.getDownloadURL()
                .then((url) => resolve({type: dropFile.type, url}))
                .catch(reject);
        }
    );
});

export const generateFileName = (originalFileName: string, uid: string) => {
    const generatedFileName = `${Math.random().toString(36).substring(7)}${originalFileName}`;
    return FirebaseDatastores.computeStoragePath(Backend.IMAGE, {name: generatedFileName}, uid).path;
};


type IDropHandlersCallbackOpts = {
    event: DragEvent;
};

export const useDropHandler = (): (opts: IDropHandlersCallbackOpts) => Promise<ReadonlyArray<UploadedFile>> => {
    const blocksTreeStore = useBlocksTreeStore();
    const userInfo = useUserInfoContext();

    return React.useCallback(async ({event}) => {
        const dropTarget = blocksTreeStore.dropTarget;
        const uid = userInfo?.userInfo?.uid;
        if (! dropTarget) {
            throw new Error("dropTarget was not found");
        }

        if (! uid) {
            throw new Error("uid was not found");
        }

        const blockID = dropTarget.id;

        if (! event.dataTransfer) {
            return [];
        }

        const {files} = event.dataTransfer;
        const knownFiles = Array.from(files)
            .map(file => ({
                    file,
                    type: getTypeFromMime(file.type),
                    id: generateFileName(file.name, uid)
            }))
            .filter((file): file is DropFile  => file.type !== 'unknown');

        const getInterstitial = (id: string) =>
            blocksTreeStore
                .getInterstitials(blockID)
                .find(item => item.id === id);

        const uploadedFiles: UploadedFile[] = [];

        // Prepare (add placeholders)
        for (const {id, file, type} of knownFiles) {
            if (type === 'image') {
                const blobURL = URL.createObjectURL(file);
                blocksTreeStore.addInterstitial(blockID, { type, target: dropTarget, id, blobURL });
            }
        }

        // Upload
        for (const dropFile of knownFiles) {
            try {
                const uploadedFile = await fileUploader(dropFile);
                if (uploadedFile.type === 'image') {
                    const interstitial = getInterstitial(dropFile.id)!;
                    const {width, height} = await Images.getDimensions(interstitial.blobURL);
                    uploadedFiles.push({
                        ...uploadedFile,
                        width,
                        height
                    });
                }
            } catch (e) {
                console.log('failed to upload file');
            }
        }

        // Cleanup
        for (const dropFile of knownFiles) {
            const interstitial = getInterstitial(dropFile.id)!;
            URL.revokeObjectURL(interstitial.blobURL);
            blocksTreeStore.removeInterstitial(blockID, interstitial.id);
        }

        return uploadedFiles;
    }, [blocksTreeStore, userInfo]);
};

const getBlockContent = (uploadedFile: UploadedFile) => {
    const {type, url} = uploadedFile;
    switch (type) {
        case 'image': 
            const {width, height} = uploadedFile;
            return new ImageContent({
                type: 'image',
                src: url,
                width: width,
                height: height,
                naturalWidth: width,
                naturalHeight: height,
            });
    }
};

type IUseDragDropHandlerOpts = {
    id: BlockIDStr;
    isRoot: boolean;
};

export const useDragDropHandler = ({ id, isRoot }: IUseDragDropHandlerOpts) => {
    const blocksTreeStore = useBlocksTreeStore();
    const dragActive = React.useRef<boolean>(false);
    const dropHandler = useDropHandler();
    const divRef = React.useRef<HTMLDivElement | null>(null);

    const computeDragPosition = React.useCallback((event: React.DragEvent | React.MouseEvent) => {
        if (! isRoot && divRef.current) {

            const bcr = divRef.current.getBoundingClientRect();

            const deltaTop = Math.abs(event.clientY - bcr.top);
            const deltaBottom = Math.abs(event.clientY - bcr.bottom);

            if (deltaTop < deltaBottom) {
                return 'top';
            }

        }

        return 'bottom';

    }, [isRoot]);
    
    const onDragStart = React.useCallback((event: React.DragEvent) => {
        blocksTreeStore.setDropSource(id);
    }, [id, blocksTreeStore]);

    const updateDropTarget = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        const pos = computeDragPosition(event);
        console.log(id, pos);

        blocksTreeStore.setDropTarget({id, pos});

    }, [computeDragPosition, id, blocksTreeStore]);

    const onDragEnter = React.useCallback((event: React.DragEvent) => {

        updateDropTarget(event);

        dragActive.current = true;

        event.preventDefault();
        event.stopPropagation();

    }, [updateDropTarget]);

    const onDragExit = React.useCallback(function (event: React.DragEvent) {

        dragActive.current = false;

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = React.useCallback((event: DragEvent) => {
        const dropTarget = blocksTreeStore.dropTarget;
        if (! dropTarget) {
            return;
        }
        
        dropHandler({event})
            .then((uploadedFiles) => {
                for (const uploadedFile of uploadedFiles) {
                    const getTargetBlock = (): { target: BlockIDStr, asChild: boolean } | undefined => {
                        const block = blocksTreeStore.getBlock(id);
                        if (! block) {
                            return undefined;
                        }
                        if (isRoot) {
                            const items = block.itemsAsArray;
                            if (items.length) {
                                return { target: items[items.length - 1], asChild: false };
                            }
                            return { target: id, asChild: true };
                        }
                        if (dropTarget.pos === 'top') {
                            const prevSibling = blocksTreeStore.prevSibling(dropTarget.id);
                            if (prevSibling) {
                                return { target: prevSibling, asChild: false };
                            }
                            if (block.parent) {
                                return { target: block.parent, asChild: true };
                            }
                        }
                        return { target: id, asChild: false };
                    };

                    const targetBlock = getTargetBlock();

                    if (targetBlock) {
                        const {target, asChild} = targetBlock;
                        blocksTreeStore.createNewBlock(target, { content: getBlockContent(uploadedFile), asChild });
                    }
                }
            }).catch(err => {
                console.error('Something happened while processing dropped file ', err);
            });

        blocksTreeStore.clearDrop();

    }, [blocksTreeStore, id, isRoot, dropHandler]);

    const onDrop = React.useCallback((event: React.DragEvent) => {

        event.preventDefault();
        event.stopPropagation();

        handleDrop(event.nativeEvent);

    }, [handleDrop]);

    return {
        ref: divRef,
        onDragLeave: onDragExit,
        onDragStart,
        onDragEnter,
        onDragExit,
        onDrop,
    };
};

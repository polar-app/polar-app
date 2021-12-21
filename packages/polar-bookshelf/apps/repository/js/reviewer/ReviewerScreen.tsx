import * as React from 'react';
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useReviewerStoreProvider} from './ReviewerStore';
import {ReviewerRunner} from './ReviewerRunner';
import {useHistory} from 'react-router-dom';
import {ReviewerDialog} from './ReviewerDialog';
import {DocFileResolvers} from "../../../../web/js/datastore/DocFileResolvers";
import {Images} from "../../../../web/js/metadata/Images";
import {usePersistenceLayerContext} from '../persistence_layer/PersistenceLayerApp';
import {IImage} from 'polar-shared/src/metadata/IImage';
import {BlockIDStr} from 'polar-blocks/src/blocks/IBlock';
import {useBlocksAnnotationRepoStore} from '../block_annotation_repo/BlocksAnnotationRepoStore';
import {ICalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ICalculatedTaskReps";
import {useBlockReviewerTasksCreator} from "./UseBlockReviewerTasksCreator";
import {IBlockTaskAction} from "./IBlockTaskAction";

export interface IBlockReviewerScreenProps {
    readonly blockIDs: ReadonlyArray<BlockIDStr>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

export const BlockReviewerScreen: React.FC<IBlockReviewerScreenProps> = deepMemo(function BlockReviewerScreen(props) {
    const { blockIDs, mode, onClose, limit } = props;
    const { persistenceLayerProvider } = usePersistenceLayerContext();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    const blockReviewerTasksCreator = useBlockReviewerTasksCreator();

    const imageResolver = React.useCallback((image: IImage) => {
        const resolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return Images.toImg(resolver, image);
    }, [persistenceLayerProvider]);

    const dataProvider = React.useCallback(async (): Promise<ICalculatedTaskReps<IBlockTaskAction>> => {

        const blocks = blocksAnnotationRepoStore.idsToRepoAnnotationBlocks(blockIDs);
        return blockReviewerTasksCreator(blocks, mode, imageResolver, limit);

    }, [blocksAnnotationRepoStore, blockIDs, blockReviewerTasksCreator, mode, imageResolver, limit]);

    const store = useReviewerStoreProvider({
        mode,
        dataProvider,
        onClose,
    });

    const history = useHistory();

    const handleClose = React.useCallback(() => {
        if (store) {
            store.onSuspended();
        }

        if (onClose) {
            onClose();
        }

        history.replace({ pathname: "/annotations", hash: "" });
    }, [history, store, onClose]);


    return (
        <ReviewerDialog onClose={handleClose}>
            <ReviewerRunner store={store} />
        </ReviewerDialog>
    );
});

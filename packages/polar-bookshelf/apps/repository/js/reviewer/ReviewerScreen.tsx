import * as React from 'react';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useReviewerStoreProvider} from './ReviewerStore';
import {ReviewerRunner} from './ReviewerRunner';
import {useHistory} from 'react-router-dom';
import {ReviewerDialog} from './ReviewerDialog';
import {CalculatedTaskReps} from 'polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator';
import {DocAnnotationReviewerTasks, IDocAnnotationTaskAction} from './DocAnnotationReviewerTasks';
import {BlockReviewerTasks, IBlockTaskAction} from './BlockReviewerTasks';
import {DocFileResolvers} from "../../../../web/js/datastore/DocFileResolvers";
import {Images} from "../../../../web/js/metadata/Images";
import {usePersistenceLayerContext} from '../persistence_layer/PersistenceLayerApp';
import {IImage} from 'polar-shared/src/metadata/IImage';
import {IBlock} from 'polar-blocks/src/blocks/IBlock';
import {IRepoAnnotationContent} from '../block_annotation_repo/BlocksAnnotationRepoStore';


/**
 * @deprecated
 */
export interface IDocAnnotationReviewerScreenProps {
    readonly annotations: ReadonlyArray<IDocAnnotation>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

/**
 * @deprecated
 */
export const DocAnnotationReviewerScreen: React.FC<IDocAnnotationReviewerScreenProps> = deepMemo(function ReviewerScreen(props) {
    const { annotations, mode, onClose, limit } = props;

    const dataProvider = React.useCallback(async (): Promise<CalculatedTaskReps<IDocAnnotationTaskAction>> => {
        return DocAnnotationReviewerTasks.createTasks(annotations, mode, limit);
    }, [annotations, mode, limit]);

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

export interface IBlockReviewerScreenProps {
    readonly blocks: ReadonlyArray<IBlock<IRepoAnnotationContent>>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

export const BlockReviewerScreen: React.FC<IBlockReviewerScreenProps> = deepMemo(function BlockReviewerScreen(props) {
    const { blocks, mode, onClose, limit } = props;
    const { persistenceLayerProvider } = usePersistenceLayerContext();

    const imageResolver = React.useCallback((image: IImage) => {
        const resolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return Images.toImg(resolver, image);
    }, [persistenceLayerProvider]);

    const dataProvider = React.useCallback(async (): Promise<CalculatedTaskReps<IBlockTaskAction>> => {
        return BlockReviewerTasks.createTasks(blocks, mode, imageResolver, limit);
    }, [blocks, mode, limit, imageResolver]);

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

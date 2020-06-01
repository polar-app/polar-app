import * as React from 'react';
import { RepoDocMetaLoader } from '../RepoDocMetaLoader';
import { RepoDocInfo } from '../RepoDocInfo';
import { RepoDocMetaManager } from '../RepoDocMetaManager';
import { DocRepoTableColumnsMap } from './DocRepoTableColumns';
import { IDocInfo } from 'polar-shared/src/metadata/IDocInfo';
import { IEventDispatcher } from '../../../../web/js/reactor/SimpleReactor';
import { PersistenceLayerController } from '../../../../web/js/datastore/PersistenceLayerManager';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import { ListenablePersistenceLayerProvider } from "../../../../web/js/datastore/PersistenceLayer";
import { TagDescriptor } from "polar-shared/src/tags/TagDescriptors";
import { DocRepoRenderProps } from "../persistence_layer/PersistenceLayerApp";
export default class DocRepoScreen extends ReleasingReactComponent<IProps, IState> {
    private readonly treeState;
    private static hasSentInitAnalytics;
    private readonly synchronizingDocLoader;
    private reactTable?;
    private readonly docRepoFilters;
    private readonly tagsProvider;
    private persistenceLayerMutator;
    constructor(props: IProps, context: any);
    private init;
    private initAsync;
    private emitInitAnalytics;
    private onDocTagged;
    private onRemoveFromTag;
    private onMultiDeleted;
    private clearSelected;
    private getSelected;
    private getRow;
    selectRow(selectedIdx: number, event: React.MouseEvent, type: SelectRowType): void;
    onSelected(selected: ReadonlyArray<number>): void;
    private createDeviceProps;
    render(): JSX.Element;
    private onDragStart;
    private onDragEnd;
    private onDocDeleteRequested;
    private onDocSidebarVisible;
    private onDocDeleted;
    private onDocSetTitle;
    private onSelectedColumns;
    private onFilterByTitle;
    private refresh;
    private onData;
    private onToggleFlaggedOnly;
    private onToggleFilterArchived;
}
interface IProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly tags: () => ReadonlyArray<TagDescriptor>;
    readonly docRepo: DocRepoRenderProps;
}
interface IState {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly columns: DocRepoTableColumnsMap;
    readonly selected: ReadonlyArray<number>;
    readonly docSidebarVisible: boolean;
}
export declare type SelectRowType = 'click' | 'context' | 'checkbox';
export {};

import * as React from 'react';
import {DocButton} from "../../ui/DocButton";
import {TagInput} from "../../TagInput";
import {FlagDocButton} from "../../ui/FlagDocButton";
import {ArchiveDocButton} from "../../ui/ArchiveDocButton";
import {DocDropdown} from "../../DocDropdown";
import {RelatedTags} from "../../../../../web/js/tags/related/RelatedTags";
import {Tag} from "polar-shared/src/tags/Tags";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {RepoDocInfo} from "../../RepoDocInfo";
import {OnRemoveFromFolderCallback} from "../../DocDropdownItems";
import {Filters} from "../DocRepoFilters";
import {SelectRowType} from "../DocRepoScreen";
import {ReactComponents} from "../../../../../web/js/react/ReactComponents";
import {DeviceRouter} from "../../../../../web/js/ui/DeviceRouter";

namespace devices {

    export interface DeviceProps extends IProps {
        getRepoDocInfo(): RepoDocInfo;
        dispatchOnDocTagged(tags: ReadonlyArray<Tag>): void;
        selectCurrentRow(event: React.MouseEvent<HTMLDivElement>, type: SelectRowType): void;
        dispatchDoHandleToggleField(type: ToggleFieldType): void;
    }

    const ContextDropdown = (props: DeviceProps) => (

        <div onContextMenu={(event) => props.selectCurrentRow(event, 'context')}
             onClick={(event) => props.selectCurrentRow(event, 'click')}>

            <DocButton>

                <DocDropdown id={'doc-dropdown-' + props.viewIndex}
                             filters={props.filters}
                             getSelected={props.getSelected}
                             onDelete={props.onDocDeleteRequested}
                             onSetTitle={props.onDocSetTitle}
                             onDocumentLoadRequested={props.onDocumentLoadRequested}
                             onRemoveFromFolder={props.onRemoveFromFolder}/>

            </DocButton>

        </div>

    );

    export const PhoneAndTablet = (props: DeviceProps) => (

        <div className="doc-buttons" style={{display: 'flex'}}>

            <ContextDropdown {...props}/>

        </div>

    );

    export const Desktop = (props: DeviceProps) => {

        const {flagged, archived} = props;

        const existingTags = (): ReadonlyArray<Tag> => {
            const repoDocInfo = props.getRepoDocInfo();
            return Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));
        };

        return (

            <div className="doc-buttons" style={{display: 'flex'}}>

                <DocButton>

                    <TagInput availableTags={props.tagsProvider()}
                              existingTags={existingTags}
                              relatedTags={props.relatedTags}
                              className="m-0 p-0 doc-button doc-button-inactive"
                              onChange={(tags) => props.dispatchOnDocTagged(tags)}/>

                </DocButton>

                <FlagDocButton active={flagged}
                               onClick={() => props.dispatchDoHandleToggleField('flagged')}/>

                <ArchiveDocButton active={archived}
                                  onClick={() => props.dispatchDoHandleToggleField('archived')}/>

                <ContextDropdown {...props}/>

            </div>

        );
    };
}




export class DocButtonsCell extends React.Component<IProps> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.selectCurrentRow = this.selectCurrentRow.bind(this);
        this.getRepoDocInfo = this.getRepoDocInfo.bind(this);
        this.onDocTagged = this.onDocTagged.bind(this);
        this.doHandleToggleField = this.doHandleToggleField.bind(this);

    }

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {
        return ReactComponents.shouldComponentUpdate(this.props, nextProps, ['viewIndex', 'flagged', 'archived']);
    }

    public render() {

        const deviceProps: devices.DeviceProps = {
            ...this.props,
            getRepoDocInfo: () => this.getRepoDocInfo(),
            dispatchOnDocTagged: (tags) => this.onDocTagged(tags),
            selectCurrentRow: (event, type) => this.selectCurrentRow(event, type),
            dispatchDoHandleToggleField: (type) => this.doHandleToggleField(type)
        };

        return <DeviceRouter phone={<devices.PhoneAndTablet {...deviceProps}/>}
                             tablet={<devices.PhoneAndTablet {...deviceProps}/>}
                             desktop={<devices.Desktop {...deviceProps}/>}/>;

    }

    private getRepoDocInfo(): RepoDocInfo {
        const {viewIndex} = this.props;
        return this.props.getRow(viewIndex);
    }

    private onDocTagged(tags: ReadonlyArray<Tag>) {
        const repoDocInfo = this.getRepoDocInfo();
        this.props.onDocTagged(repoDocInfo, tags);
    }

    private doHandleToggleField(type: ToggleFieldType) {
        const repoDocInfo = this.getRepoDocInfo();
        this.props.doHandleToggleField(repoDocInfo, type);
    }

    private selectCurrentRow(event: React.MouseEvent<HTMLDivElement>, type: SelectRowType) {
        const {viewIndex} = this.props;
        this.props.selectRow(viewIndex, event.nativeEvent, type);
    }

}

interface IProps {
    readonly viewIndex: number;
    readonly flagged: boolean;
    readonly archived: boolean;
    readonly getSelected: () => ReadonlyArray<RepoDocInfo>;
    readonly filters: Filters;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly relatedTags: RelatedTags;
    readonly onDocTagged: (repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) => void;
    readonly onDocDeleteRequested: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onDocSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onRemoveFromFolder: OnRemoveFromFolderCallback;
    readonly doHandleToggleField: (repoDocInfo: RepoDocInfo, type: ToggleFieldType) => void;
    readonly selectRow: (selectedIdx: number, event: MouseEvent, type: SelectRowType) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
    readonly getRow: (viewIndex: number) => RepoDocInfo;
}

type ToggleFieldType = 'flagged' | 'archived';

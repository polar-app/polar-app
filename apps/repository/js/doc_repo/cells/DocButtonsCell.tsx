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
import {FastComponent} from "../../../../../web/js/react/FastComponent";
import deepEqual from "react-fast-compare";

export class DocButtonsCell extends FastComponent<IProps> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.selectCurrentRow = this.selectCurrentRow.bind(this);
        this.getRepoDocInfo = this.getRepoDocInfo.bind(this);
        this.onDocTagged = this.onDocTagged.bind(this);
        this.doHandleToggleField = this.doHandleToggleField.bind(this);

    }

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {

        const canonicalize = (props: IProps) => {
            return {
                viewIndex: props.viewIndex,
                flagged: props.flagged,
                archived: props.archived
            };
        };

        if (! deepEqual(canonicalize(this.props), canonicalize(nextProps))) {
            return true;
        }

        return false;

    }

    public render() {

        console.log("FIXME: rendering");

        const {viewIndex, flagged, archived} = this.props;

        const existingTags = (): ReadonlyArray<Tag> => {
            const repoDocInfo = this.getRepoDocInfo();
            return Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));
        };

        return (

            <div className="doc-buttons" style={{display: 'flex'}}>

                <DocButton>

                    {/*WARNING: making this a function breaks the layout...*/}

                    <TagInput availableTags={this.props.tagsProvider()}
                              existingTags={existingTags}
                              relatedTags={this.props.relatedTags}
                              onChange={(tags) => this.onDocTagged(tags)}/>

                </DocButton>

                <FlagDocButton active={flagged}
                               onClick={() => this.doHandleToggleField('flagged')}/>

                <ArchiveDocButton active={archived}
                                  onClick={() => this.doHandleToggleField('archived')}/>

                <div onContextMenu={(event) => this.selectCurrentRow(event, 'context')}
                     onClick={(event) => this.selectCurrentRow(event, 'click')}>

                    <DocButton>

                        <DocDropdown id={'doc-dropdown-' + viewIndex}
                                     filters={this.props.filters}
                                     getSelected={this.props.getSelected}
                                     onDelete={this.props.onDocDeleteRequested}
                                     onSetTitle={this.props.onDocSetTitle}
                                     onDocumentLoadRequested={this.props.onDocumentLoadRequested}
                                     onRemoveFromFolder={this.props.onRemoveFromFolder}/>

                    </DocButton>

                </div>

            </div>
        );

    }

    private getRepoDocInfo() {
        const {viewIndex} = this.props;
        return this.props.getRow(viewIndex);
    };

    private onDocTagged(tags: ReadonlyArray<Tag>) {
        const repoDocInfo = this.getRepoDocInfo();
        this.props.onDocTagged(repoDocInfo, tags);
    }

    private doHandleToggleField(type: ToggleFieldType) {
        const repoDocInfo = this.getRepoDocInfo();
        this.props.doHandleToggleField(repoDocInfo, type);
    }

    private selectCurrentRow (event: React.MouseEvent<HTMLDivElement>, type: SelectRowType) {
        const {viewIndex} = this.props;
        this.props.selectRow(viewIndex, event.nativeEvent, type)
    };


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

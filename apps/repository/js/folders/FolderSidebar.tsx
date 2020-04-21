import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {ContextMenuComponents, FolderContextMenus} from "./FolderContextMenus";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";
import {Tag} from "polar-shared/src/tags/Tags";
import {AddTagsDropdown} from "./AddTagsDropdown";
import {Strings} from 'polar-shared/src/util/Strings';
import SearchBox from '../../../../web/spectron0/material-ui/SearchBox';
import Paper from '@material-ui/core/Paper';
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";

export class FolderSidebar extends React.Component<FoldersSidebarProps, IState> {

    private folderContextMenuComponents: ContextMenuComponents;

    private tagContextMenuComponents: ContextMenuComponents;

    constructor(props: FoldersSidebarProps, context: any) {
        super(props, context);

        this.setFilter = this.setFilter.bind(this);

        const {treeState, persistenceLayerMutator} = this.props;

        this.folderContextMenuComponents
            = FolderContextMenus.create({
                type: 'folder',
                treeState,
                persistenceLayerMutator,
            });

        this.tagContextMenuComponents
            = FolderContextMenus.create({
                type: 'tag',
                treeState,
                persistenceLayerMutator,
            });

        this.state = {
            filter: undefined
        };

    }

    public render() {

        const {treeState} = this.props;

        const computeTags = () => {

            const filter = this.state.filter;
            const tags = this.props.tags;

            if (filter && ! Strings.empty(filter)) {

                const predicate = (tag: Tag) => {
                    return tag.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                };

                return tags.filter(predicate);
            } else {
                return tags;
            }

        };

        const tags = computeTags();

        return (

            <Paper square
                   style={{
                       display: 'flex' ,
                       flexDirection: 'column',
                       height: '100%'
                    }}>

                <Paper square
                       className=""
                       style={{
                           height: '100%',
                           display: 'flex' ,
                           flexDirection: 'column',
                       }}>

                    {this.folderContextMenuComponents.contextMenu()}

                    {this.tagContextMenuComponents.contextMenu()}

                    <MUIPaperToolbar borderBottom
                                     padding={0.5}>
                        <div style={{
                                 display: 'flex'
                             }}>


                            {/*<InputFilter placeholder="Filter by tag or folder"*/}
                            {/*             style={{*/}
                            {/*                 flexGrow: 1*/}
                            {/*             }}*/}
                            {/*             onChange={value => this.setFilter(value)}/>*/}

                            <SearchBox
                                   // type="search"
                                   placeholder="Filter by tag or folder"
                                   style={{
                                       flexGrow: 1
                                   }}
                                   onChange={text => this.setFilter(text)}/>

                            <div className="ml-1">
                                <AddTagsDropdown createUserTagCallback={this.folderContextMenuComponents.createUserTag}/>
                            </div>

                        </div>
                    </MUIPaperToolbar>

                    <div style={{
                            flexGrow: 1,
                            overflow: 'auto',
                        }}>

                        <TagTree tags={tags}
                                 treeState={treeState}
                                 rootTitle="Folders"
                                 tagType='folder'
                                 filterDisabled={true}
                                 nodeContextMenuRender={this.folderContextMenuComponents.render}
                                 noCreate={true}/>

                        <TagTree tags={tags}
                                 treeState={treeState}
                                 rootTitle="Tags"
                                 tagType='regular'
                                 filterDisabled={true}
                                 nodeContextMenuRender={this.tagContextMenuComponents.render}
                                 noCreate={true}/>
                    </div>

                </Paper>

            </Paper>
        );
    }

    private setFilter(filter: string) {
        this.setState({
            ...this.state,
            filter
        });
    }

}

export interface FoldersSidebarProps {

    readonly persistenceLayerMutator: PersistenceLayerMutator;
    readonly treeState: TreeState<TagDescriptor>;
    readonly tags: ReadonlyArray<TagDescriptor>;

}

export interface IState {
    readonly filter?: string;
}


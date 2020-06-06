import * as React from 'react';
import {TreeView, TRoot} from './TreeView';
import {Tag} from 'polar-shared/src/tags/Tags';
import {TagFilter} from './TagFilter';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {TagNodes, TagType} from "../../tags/TagNodes";
import {TreeState} from "./TreeState";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: 'var(--primary-background-color)',
    };

    public static BAR: React.CSSProperties = {
        display: 'flex',
    };

    public static FILTER_INPUT: React.CSSProperties = {
        height: 'auto',
        // fontFamily: 'sans-serif',
        fontSize: '1.0em'
    };

}

// FIXME: migrate this to a functional component...
export class TagTree extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelectedTags = this.onSelectedTags.bind(this);
        this.onFiltered = this.onFiltered.bind(this);
        this.onCreated = this.onCreated.bind(this);

        this.state = {
            filter: "",
        };

    }

    public render() {

        const tags = filterTags(this.props.tags, this.state.filter);

        const createRoot = (): TRoot<TagDescriptor> => {

            switch (this.props.tagType) {
                case "folder":
                    const root: TRoot<TagDescriptor> = {
                        ...TagNodes.createFoldersRoot({tags, type: 'folder'}),
                        title: this.props.rootTitle
                    };

                    return root;

                case "regular":
                    return TagNodes.createTagsRoot(tags);

            }

        };

        const root = createRoot();

        return (

            <div style={Styles.PARENT}>

                <div style={Styles.BAR}>

                    <div style={{flexGrow: 1}}>
                        <TagFilter tags={tags}
                                   onChange={tags => this.onSelectedTags(tags)}
                                   disabled={this.props.filterDisabled}/>
                    </div>

                    <NullCollapse open={!this.props.noCreate}>

                        {/*<TagCreateButton selected={this.props.selected}*/}
                        {/*                 onCreated={path => this.onCreated(path)}/>*/}

                    </NullCollapse>

                </div>

                <TreeView roots={[root]}
                          nodeContextMenuRender={this.props.nodeContextMenuRender}
                          treeState={this.props.treeState}/>

            </div>

        );

    }

    private onCreated(path: string) {

        const tags = [...this.props.tags];

        tags.push({
            label: path,
            id: path,
            members: [],
            count: 0
        });

        this.setState({...this.state});

    }

    private onSelectedTags(selected: ReadonlyArray<Tag>) {
        this.props.treeState.tags = selected;
        this.props.treeState.dispatchSelected();
    }

    private onFiltered(filter: string) {
        this.setState({filter});
    }

}

export type NodeContextMenuRenderCallback = (child: React.ReactElement) => void;

interface IProps {

    readonly treeState: TreeState<TagDescriptor>;

    readonly tags: ReadonlyArray<TagDescriptor>;

    readonly tagType: TagType;

    readonly noCreate?: boolean;

    readonly rootTitle?: string;

    readonly filterDisabled?: boolean;

    /**
     * A render prop to render a context menu for each node.
     */
    readonly nodeContextMenuRender?: NodeContextMenuRenderCallback;

}

interface IState {
    readonly filter: string;
}

function filterTags(tags: ReadonlyArray<TagDescriptor>, filter: string): ReadonlyArray<TagDescriptor> {

    if (filter.trim() === '') {
        return tags;
    }

    filter = filter.toLocaleLowerCase();

    return tags.filter(tag => {
        const label = tag.label.toLocaleLowerCase();
        return label.indexOf(filter) !== -1;
    });

}

import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import {Dictionaries} from '../../util/Dictionaries';
import {Tag} from '../../tags/Tag';
import {TNode} from './TreeView';
import {TagNodes} from '../../tags/TagNode';
import {TreeView} from './TreeView';
import {Tags} from '../../tags/Tags';
import {TagCreateButton} from './TagCreateButton';
import {TagDescriptor} from '../../tags/TagNode';
import {TagStr} from '../../tags/Tag';
import {TagFilter} from './TagFilter';
import {NullCollapse} from '../null_collapse/NullCollapse';

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };

    public static FILTER_INPUT: React.CSSProperties = {
        height: 'auto',
        fontFamily: 'sans-serif',
        fontSize: '14px'
    };

}

export class TagTree extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelected = this.onSelected.bind(this);
        this.onFiltered = this.onFiltered.bind(this);
        this.onCreated = this.onCreated.bind(this);

        this.state = {
            filter: "",
            selected: []
        };

    }

    public render() {

        const tags = filterTags(this.props.tags, this.state.filter);

        const root: TNode<TagDescriptor> = TagNodes.create(...tags);

        return (

            <div style={Styles.PARENT}>

                <div style={{display: 'flex'}}>

                    {/*<Input className="p-1 pb-0 pt-0"*/}
                    {/*       style={Styles.FILTER_INPUT}*/}
                    {/*       onChange={event => this.onFiltered(event.currentTarget.value)}*/}
                    {/*       placeholder="Filter by name..." />*/}

                    <div style={{flexGrow: 1}}>
                        <TagFilter tags={this.props.tags}/>
                    </div>

                    <NullCollapse open={!this.props.noCreate}>

                        <TagCreateButton selected={this.state.selected}
                                         onCreated={path => this.onCreated(path)}/>

                    </NullCollapse>

                </div>

                <TreeView root={root} onSelected={values => this.onSelected(values)}/>

            </div>

        );

    }

    private onCreated(path: string) {

        // FIXME: this needs to push out so that it's re-called again with new
        // tags

        const tags = [...this.props.tags];

        tags.push({
            label: path,
            id: path,
            count: 0
        });

        this.setState({...this.state});

    }

    private onSelected(selected: ReadonlyArray<TagStr>) {

        this.setState({...this.state, selected});

        this.props.onSelected(...selected);

    }

    private onFiltered(filter: string) {

        this.setState({filter});

    }

}

interface IProps {
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly onSelected: (...selected: ReadonlyArray<TagStr>) => void;
    readonly noCreate?: boolean;
}

interface IState {
    readonly filter: string;
    readonly selected: ReadonlyArray<TagStr>;
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

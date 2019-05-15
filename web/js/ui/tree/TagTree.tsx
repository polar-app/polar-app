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

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };

    public static HEADER: React.CSSProperties = {
    };

    public static BODY: React.CSSProperties = {
        flexGrow: 1
    };

    public static FILTER_INPUT: React.CSSProperties = {
        height: 'auto',
        fontFamily: 'sans-serif',
        fontSize: '14px'
    };

}

export class TagTree extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelected = this.onSelected.bind(this);
        this.onFiltered = this.onFiltered.bind(this);
        this.onCreated = this.onCreated.bind(this);

        this.state = {
            filter: "Comp",
            tags: this.props.tags,
            selected: []
        };

    }

    public render() {

        // FIXME: this will NOT work I think because the IDs each time keep
        // changing???  but the TreeState should be reset each time I think.

        const root: TNode<TagDescriptor> = TagNodes.create(...this.state.tags);

        return (

            <div style={Styles.PARENT}>

                {/*FIXME: redo the way we do filters... filter the INPUT on the full*/}
                {/*path and then filter pass this to the view once we've converted*/}
                {/*them to full tags.*/}

                {/*<InputGroup className="m-1"*/}
                {/*            style={Styles.HEADER}>*/}

                {/*    <InputGroupAddon addonType="append">*/}
                {/*        X*/}
                {/*    </InputGroupAddon>*/}

                <div style={{display: 'flex'}}>

                    <Input className="p-1 pb-0 pt-0"
                           style={Styles.FILTER_INPUT}
                           onChange={event => this.onFiltered(event.currentTarget.value)}
                           placeholder="Filter by name..." />

                    <TagCreateButton selected={this.state.selected}
                                     onCreated={path => this.onCreated(path)}/>

                </div>

                <TreeView root={root} onSelected={values => this.onSelected(values)}/>

            </div>

        );

    }

    private onCreated(path: string) {
        console.log("New tag created: " + path);
    }

    private onSelected(selected: ReadonlyArray<TagDescriptor>) {

        this.setState({...this.state, selected});

        this.props.onSelected(...selected);

    }

    private onFiltered(filter: string) {

        // TODO: one strategy here is to create ALL possible paths, then
        // find just the unique ones, then filter just on those and then use
        // THOSE as the result.

        // FIXME: ... TODO... this doesn't break out all unique sub-paths.

        filter = filter.toLocaleLowerCase();

        const tags = this.props.tags.filter(tag => {
            const label = tag.label.toLocaleLowerCase();
            return label.indexOf(filter) !== -1;
        });

        this.setState({tags, filter});

    }

}

interface IProps {
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly onSelected: (...selected: ReadonlyArray<Tag>) => void;
}

interface IState {
    readonly filter: string;
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly selected: ReadonlyArray<TagDescriptor>;
}



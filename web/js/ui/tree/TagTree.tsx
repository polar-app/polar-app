import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import {Dictionaries} from '../../util/Dictionaries';

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

}

export class TreeView<V> extends DeepPureComponent<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

    }

    public render() {

        const treeState = new TreeState(this.props.onSelected);

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

                    <Input className="p-1" placeholder="Filter by name..." />

                    <Button className="ml-1" color="light" title="Create new folder">

                        <i className="hover-button fas fa-plus"></i>

                    </Button>

                </div>

                {/*</InputGroup>*/}

                <div style={Styles.HEADER}>
                    <TreeNode node={this.props.root} treeState={treeState}/>
                </div>

            </div>

        );

    }

}

interface IProps<V> {
    readonly root: TNode<V>;
    readonly onSelected: (...nodes: ReadonlyArray<V>) => void;
}

interface IState {

}


/**
 * A state object for the entire tree to keep an index of expanded/collapsed
 * nodes, etc.
 */
export class TreeState<V> {

    constructor(public readonly onSelected: (...nodes: ReadonlyArray<V>) => void) {
    }

    public readonly closed = new Marked();

    /**
     * The currently applied filter for the path we're searching for.
     */
    public readonly filter = "";

    /**
     * The list of the nodes that are selected by id
     */
    public readonly selected: {[id: number]: number} = [];

    public readonly index: {[id: number]: TreeNode<V>} = [];

}


export class Marked {

    public readonly data: {[id: number]: boolean} = {};

    public mark(id: number) {
        this.data[id] = true;
    }

    public clear(id: number) {
        delete this.data[id];
    }

    public toggle(id: number) {
        this.data[id] = ! this.data[id];
        return this.data[id];
    }

    public contains(id: number) {
        return this.data[id];
    }

    public reset() {
        Dictionaries.empty(this.data);
    }

}

export interface TNode<V> {

    readonly name: string;

    readonly children: ReadonlyArray<TNode<V>>;

    /**
     * The UNIQUE id for this node.
     */
    readonly id: number;

    readonly value: V;

}


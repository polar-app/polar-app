import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNodeChildren} from './TreeNodeChildren';
import Button from 'reactstrap/lib/Button';
import {Dictionaries} from '../../util/Dictionaries';
import {isPresent} from '../../Preconditions';
import {Preconditions} from '../../Preconditions';

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
        marginTop: '2px'
    };

    public static NODE_ICON: React.CSSProperties = {
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '0px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: 'var(--secondary)',
        cursor: 'pointer',
        userSelect: 'none',
        // this has to be fixed width or each layer doesn't line up.
        width: '12px',
        // height: '20px'
    };

    public static NODE_NAME: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: '2px',
        fontSize: '15px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        paddingRight: '5px',
        fontFamily: 'sans-serif',
        boxShadow: 'none'
    };


    public static NODE_SELECTOR: React.CSSProperties = {
        lineHeight: '1.5',
        fontSize: '15px',
        userSelect: 'none',
        marginTop: 'auto',
        marginBottom: 'auto',
        paddingLeft: '5px',

    };

    public static NODE_BODY: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        // paddingLeft: '5px',
    };
}

// TODO

//   - what about long press?
//   - what about context menus?
//   - FIXME: implement the onSelect handler to callback which nodes are
//    actually selected and an object for each node.

export class TreeNode<V> extends DeepPureComponent<IProps<V>, IState<V>> {

    public readonly id: number;
    public readonly value: V;

    constructor(props: IProps<V>, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
        this.onCheckbox = this.onCheckbox.bind(this);
        this.onClick = this.onClick.bind(this);
        this.dispatchSelected = this.dispatchSelected.bind(this);

        this.id = this.props.node.id;
        this.value = this.props.node.value;

        this.state = {
            node: props.node
        };

        // during expand/collapse new nodes are created and we have to keep the
        // index updated or we will access a component that no longer exists.

        this.props.treeState.index[this.id] = this;

    }

    public render() {

        const {treeState} = this.props;
        const {node} = this.state;
        const children = node.children || [];

        const createIcon = () => {

            if (children.length > 0) {

                // if (this.state.node.closed) {
                //     return 'fas fa-caret-right';
                // } else {
                //     return 'fas fa-caret-down';
                // }

                // if (closed) {
                //     return 'fas fa-plus';
                // } else {
                //     return 'fas fa-minus';
                // }

                if (closed) {
                    return 'far fa-plus-square';
                } else {
                    return 'far fa-minus-square';
                }

                // <i className="far fa-plus-square"></i>
            }

            // return "far fa-file";
            return "";

        };

        const selected = isPresent(treeState.selected[this.id]);

        const closed = treeState.closed.contains(node.id);

        const nodeButtonClazz = selected ? 'bg-primary text-white' : '';

        const icon = createIcon();

        return (

            <div style={{}}>

                <div style={Styles.NODE_PARENT}>

                    <div style={Styles.NODE_ICON}
                         className={icon}
                         onClick={() => this.toggle()}>
                    </div>

                    <div style={Styles.NODE_SELECTOR}>
                        {/*<Input className="m-0" type="checkbox" />*/}
                        {/*X*/}
                        <input className="m-0"
                               checked={selected}
                               type="checkbox"
                               onChange={event => this.onCheckbox(event)}/>

                    </div>

                    <div style={Styles.NODE_BODY}>

                        <Button style={Styles.NODE_NAME}
                                className={"p-0 pl-1 pr-1 border-0 " + nodeButtonClazz}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => this.onClick(event)}
                                color="light">

                            {node.name}

                        </Button>

                    </div>

                </div>

                <TreeNodeChildren children={children} closed={closed} treeState={this.props.treeState}/>

            </div>

        );

    }

    private onClick(event: React.MouseEvent<HTMLButtonElement>) {
        const multi = event.ctrlKey;
        this.select(multi);
    }

    private onCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        this.select(true, event.target.checked);
    }

    private toggle() {

        const children = this.state.node.children || [];

        if (children.length === 0) {
            // doesn't make sense to expand/collapse something without children.
            return;
        }

        this.props.treeState.closed.toggle(this.props.node.id);

        this.setState({...this.state, node: this.state.node, idx: Date.now()});

    }

    private deselect() {
        delete this.props.treeState.selected[this.id];
        this.setState({...this.state, idx: Date.now()});
    }

    private select(multi: boolean = false,
                   selected: boolean = true) {

        const {treeState} = this.props;

        if (!multi) {

            for (const id of Object.values(treeState.selected)) {

                const node = treeState.index[id];
                Preconditions.assertPresent(node, "No node for id: " + id);

                node.deselect();
                delete treeState.selected[id];

            }

        }

        if (selected) {
            treeState.selected[this.id] = this.id;
        } else {
            delete treeState.selected[this.id];
        }

        this.setState({...this.state, idx: Date.now()});

        this.dispatchSelected();

    }

    private dispatchSelected() {
        const {treeState} = this.props;

        const values: V[] = [];

        for (const id of Object.values(treeState.selected)) {
            const node = treeState.index[id];
            values.push(node.value);
        }

        treeState.onSelected(...values);

    }

}

interface IProps<V> {
    readonly node: TNode<V>;
    readonly treeState: TreeState<V>;
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
     * The list of the nodes that are selected by id
     */
    public selected: {[id: number]: number} = [];

    public index: {[id: number]: TreeNode<V>} = [];

}

class Marked {

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

    name: string;

    children: ReadonlyArray<TNode<V>>;

    /**
     * The UNIQUE id for this node.
     */
    readonly id: number;

    readonly value: V;

}

interface IState<V> {
    readonly idx?: number;
    readonly node: TNode<V>;
}



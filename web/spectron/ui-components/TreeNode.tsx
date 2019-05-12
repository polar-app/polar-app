import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';
import {TreeNodeChildren} from './TreeNodeChildren';
import Button from 'reactstrap/lib/Button';
import {Dictionaries} from '../../js/util/Dictionaries';

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
    };

    public static NODE_ICON: React.CSSProperties = {
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '5px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: 'var(--secondary)',
        cursor: 'pointer',
        userSelect: 'none',
        width: '12px',
        // height: '20px'
    };

    public static NODE_NAME: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: '16px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        paddingLeft: '5px',
        paddingRight: '5px'
    };

}

// TODO
// - make them hover optionally
//   - we need an 'icon' that represents an entry with just a horizontal line instead of a file icon.
//   - toggling up and going to the root triggers them ALL to expand and not
//     sure why. Might make sense to just cheat and mutate the objects directly.
//   - icons aren't rendered properly in the UI and have too much margin
//   - revert BACK from button
//   - no code to SELECT an item ...
//   - onSelected function
//   - what about long press?
//   - what about context menus?
//   - should we support N selected items or just one?

export class TreeNode extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);

        this.state = {
            node: props.node
        };

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

                if (closed) {
                    return 'fas fa-plus';
                } else {
                    return 'fas fa-minus';
                }

            }

            // return "far fa-file";
            return "";

        };

        const selected = treeState.selected.contains(node.id);
        const closed = treeState.closed.contains(node.id);

        const nodeButtonColor = selected ? 'primary' : 'white';

        const icon = createIcon();

        return (

            <div style={{}}>

                <div style={Styles.NODE_PARENT}>

                    <div style={Styles.NODE_ICON}
                         className={icon}
                         onClick={() => this.toggle()}>
                    </div>

                    <Button style={Styles.NODE_NAME}
                            className="p-0 pl-1 pr-1"
                            onClick={() => this.select()}
                            color={nodeButtonColor}>
                        {node.name}
                    </Button>

                </div>

                <TreeNodeChildren children={children} closed={closed} treeState={this.props.treeState}/>

            </div>

        );

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

    private select() {

        this.props.treeState.selected.reset();
        this.props.treeState.selected.toggle(this.props.node.id);

        this.setState({...this.state, idx: Date.now()});

    }


}

interface IProps {
    readonly node: TNode;
    readonly treeState: TreeState;
}


/**
 * A state object for the entire tree to keep an index of expanded/collapsed
 * nodes, etc.
 */
export class TreeState {

    public readonly closed = new Marked();

    public readonly selected = new Marked();

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

export interface TNode {

    name: string;

    children: TNode[];

    /**
     * The UNIQUE id for this node.
     */
    readonly id: number;

}

export class TNodes {

    public static idx = 0;

    // /**
    //  * Create TNodes with a correct index.
    //  */
    // public static create(node: TNodePartial): TNode {
    //
    //     const children
    //         = node.children.map(child => this.create(child));
    //
    //     return {
    //         id: this.idx++,
    //         name: node.name,
    //         children
    //     };
    //
    // }

}

interface IState {
    readonly idx?: number;
    readonly node: TNode;
}



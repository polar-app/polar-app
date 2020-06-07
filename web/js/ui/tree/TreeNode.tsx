import * as React from 'react';
import {TreeNodeChildren} from './TreeNodeChildren';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {DragTarget} from "./DragTarget";
import {TreeState} from "./TreeState";
import {Checkbox} from "../Checkbox";
import {TNode} from "./TNode";

const DEFAULT_NODE_CONTEXT_MENU_RENDER = (child: React.ReactElement) => {
    return <div>{child}</div>;
};

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
        paddingTop: '2px',
        paddingLeft: '5px'
    };

    public static NODE_ICON: React.CSSProperties = {
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '0px',
        fontSize: '1.0em',
        lineHeight: '1.5',
        // color: 'var(--secondary)',
        cursor: 'pointer',
        userSelect: 'none',
        // this has to be fixed width or each layer doesn't line up.
        width: '12px',
        minWidth: '12px',
        // height: '20px'
    };

    public static NODE_BUTTON: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: '2px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        paddingRight: '5px',
        // fontFamily: 'sans-serif',
        fontSize: '1.0em',
        boxShadow: 'none',

        color: 'var(--secondary)',

        outline: 'none',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px',

        // this isn't working because the width isn't constrained
        overflow: 'hidden',
        textOverflow: 'ellipsis'

    };

    public static NODE_SELECTOR: React.CSSProperties = {
        lineHeight: '1.5',
        userSelect: 'none',
        marginTop: 'auto',
        marginBottom: 'auto',
        paddingLeft: '2px',

    };

    public static NODE_BODY: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        // paddingLeft: '5px',
        flexGrow: 1,
    };

    public static NODE_RIGHT: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',

        lineHeight: '1.5',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        marginRight: '5px',
        // fontFamily: 'sans-serif',
        boxShadow: 'none',
        color: 'var(--grey300)',

        display: 'flex',

    };

    public static CREATE_BUTTON: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px'

    };

    public static CREATE_ICON: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',

        fontSize: '1.0em',
        lineHeight: '1.5',
        userSelect: 'none',
        whiteSpace: 'nowrap',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px'

    };

}

export class TreeNode<V> extends React.Component<IProps<V>, IState<V>> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

        this.toggleClosed = this.toggleClosed.bind(this);
        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
        this.onCheckbox = this.onCheckbox.bind(this);
        this.onClick = this.onClick.bind(this);
        this.dispatchSelected = this.dispatchSelected.bind(this);

        this.state = {
        };

    }

    public render() {

        const {treeState} = this.props;
        const {node} = this.props;
        const children = node.children || [];

        const {id} = this.props.node;

        // during expand/collapse new nodes are created and we have to keep the
        // index updated or we will access a component that no longer exists.
        // not sure why but this needs to be updated for each render and
        // components aren't always created.
        treeState.index[id] = this;

        const createIcon = () => {

            if (children.length > 0) {

                if (closed) {
                    return 'far fa-plus-square';
                } else {
                    return 'far fa-minus-square';
                }

            }

            return "";

        };
        const selected = treeState.selected.isMarked(id);

        const closed = treeState.closed.isMarked(node.id);

        const nodeButtonClazz = selected ? 'bg-primary text-white' : '';

        const icon = createIcon();

        const nodeContextMenuRender
            = this.props.nodeContextMenuRender || DEFAULT_NODE_CONTEXT_MENU_RENDER;

        return (

            <div style={{}}>

                {nodeContextMenuRender(
                    <DragTarget onDropped={() => this.props.treeState.dispatchDropped(node.value)}>

                        <div style={Styles.NODE_PARENT}
                             className="">

                            <div style={Styles.NODE_ICON}
                                 className={icon}
                                 onClick={() => this.toggleClosed()}>
                            </div>

                            <div style={Styles.NODE_SELECTOR}>

                                <Checkbox className="m-0 text-secondary"
                                          checked={selected}
                                          style={{
                                              display: 'block',
                                              fontSize: '1.0em',
                                          }}
                                          onContextMenu={(event) => this.onClick(event)}
                                          onClick={() => this.onCheckbox(! selected)}/>

                            </div>

                            <div style={Styles.NODE_BODY}
                                 onDoubleClick={() => this.toggleClosed()}
                                 onContextMenu={(event) => this.onClick(event)}
                                 onClick={(event) => this.onClick(event)}>

                                <button style={Styles.NODE_BUTTON}
                                        className={"p-0 pl-1 pr-1 border-0 no-outline " + nodeButtonClazz}
                                        >

                                    {this.props.title || node.name}

                                </button>

                            </div>

                            <div style={Styles.NODE_RIGHT}
                                 onDoubleClick={() => this.toggleClosed()}
                                 onContextMenu={(event) => this.onClick(event)}>

                                <div>
                                    {node.count}
                                </div>

                            </div>

                        </div>
                    </DragTarget>
                )}

                <TreeNodeChildren children={children}
                                  closed={closed}
                                  nodeContextMenuRender={this.props.nodeContextMenuRender}
                                  treeState={this.props.treeState}/>

            </div>

        );

    }

    private onClick(event: React.MouseEvent<HTMLElement>) {
        const multi = event.ctrlKey;
        this.select(multi);
    }

    private onCheckbox(checked: boolean) {
        this.select(true, checked);
    }

    private toggleClosed() {

        const children = this.props.node.children || [];

        if (children.length === 0) {
            // doesn't make sense to expand/collapse something without children.
            return;
        }

        this.props.treeState.closed.toggle(this.props.node.id);

        // needed to cause the tree to re-render when we have collapsed a folder.
        this.dispatchSelected();

    }

    private deselect() {
        const {id} = this.props.node;
        this.props.treeState.selected.delete(id);
    }

    private select(multi: boolean = false,
                   selected: boolean = true) {

        const {treeState} = this.props;
        const {id} = this.props.node;

        if (!multi) {

            for (const id of treeState.selected.keys()) {

                const node = treeState.index[id];
                Preconditions.assertPresent(node, "No node for id: " + id);

                node.deselect();
                treeState.selected.delete(id);

            }

        }

        treeState.selected.mark(id, selected);

        // TODO: don't do this type of refresh
        this.dispatchSelected();

    }

    private dispatchSelected() {
        this.props.treeState.dispatchSelected();
    }

}

interface IProps<V> {

    /**
     * An alternative human readable title for this node.
     */
    readonly title?: string;

    readonly node: TNode<V>;

    readonly treeState: TreeState<V>;

    readonly nodeContextMenuRender?: (child: React.ReactElement) => void;

}


interface IState<V> {
}



import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';
import {TreeNodeChildren} from './TreeNodeChildren';

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
    };

    public static NODE_ICON: React.CSSProperties = {
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '5px',
        fontSize: '19px',
        lineHeight: '1.5',
        color: 'var(--primary)',
        cursor: 'pointer',
        userSelect: 'none',
        width: '15px',
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
        paddingLeft: '3px',
        paddingRight: '3px'
    };

}

// TODO
// - make them hover optionally
//   - icons should change based on their state
//   - toggling up and going to the root triggers them ALL to expand and not
//     sure why. Might make sense to just cheat and mutate the objects directly.
//   - icons aren't rendered properly in the UI and have too much margin
//   -


export class TreeNode extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            closed: props.node.closed
        };

    }

    public render() {

        const {node} = this.props;
        const children = node.children || [];

        const createIcon = () => {

            if (children.length > 0) {

                if (this.state.closed) {
                    return 'fas fa-caret-right';
                } else {
                    return 'fas fa-caret-down';
                }

            }

            // return "far fa-file";
            return "";

        };

        const nodeNameClazz = node.selected ? 'bg-primary text-white rounded' : '';

        const icon = createIcon();

        return (

            <div style={{}}>

                <div style={Styles.NODE_PARENT}>

                    <div style={Styles.NODE_ICON}
                         className={icon}
                         onClick={() => this.toggle()}>
                    </div>

                    <div style={Styles.NODE_NAME} className={nodeNameClazz}>
                        {node.name}
                    </div>

                </div>

                <TreeNodeChildren children={children} closed={this.state.closed}/>

            </div>

        );

    }

    private toggle() {

        const {node} = this.props;
        const children = node.children || [];

        if (children.length === 0) {
            // doesn't make sense to expand/collapse something without children.
            return;
        }

        this.setState({...this.state, closed: !this.state.closed});

    }


}

interface IProps {
    readonly node: TNode;
}

export interface TNode {

    readonly name: string;

    /**
     * Whether the node is closed.  Defaults to open.
     */
    readonly closed?: boolean;

    /**
     * True when the node is selected
     */
    readonly selected?: boolean;

    readonly children?: TNode[];

}

interface IState {
    readonly closed?: boolean;
}



import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
    };

    public static NODE_ICON: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '5px',
        fontSize: '19px',
        lineHeight: '1.5',
        color: 'var(--primary)',
        cursor: 'pointer',
        userSelect: 'none'
    };

    public static NODE_NAME: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: '16px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap'
    };

}

// TODO
// - make them hover optionally
//   - optionally toggle their state
//   - a configuration for the icons

interface TreeNodeChildrenProps {
    readonly closed?: boolean;
    readonly children?: TNode[];
}

// TODO: this should be a deep / pure component too.
const TreeNodeChildren = (props: TreeNodeChildrenProps) => {

    let idx = 0;
    const children = props.children || [];

    if (props.closed) {
        return <div/>;
    } else {
        return <div style={{paddingLeft: '0.5em',
            marginLeft: '0.5em',
            borderLeft: '1px solid #c6c6c6'}}>
            {children.map(child => <TreeNode key={idx++} node={child}/>)}
        </div>;
    }

};

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
                return "fas fa-folder";
            }

            return "far fa-file";

        };

        const icon = createIcon();

        return (

            <div style={{}}>

                <div style={Styles.NODE_PARENT}>

                    <div style={Styles.NODE_ICON}
                         className={icon}
                         onClick={() => this.toggle()}>
                    </div>

                    <div style={Styles.NODE_NAME}>
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

    readonly children?: TNode[];

}

interface IState {
    readonly closed?: boolean;
}



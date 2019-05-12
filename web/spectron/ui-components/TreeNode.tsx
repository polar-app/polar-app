import * as React from 'react';

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
        color: 'var(--primary)'
    };

    public static NODE_NAME: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: '16px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none'
    };

}

// TODO
// - make them hover optionally
//   - optionally toggle their state
//   - a configuration for the icons

export class TreeNode extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false
        };

    }

    public render() {

        const {node} = this.props;
        const children = node.children || [];

        let idx = 0;
        //
        // <i className="fas fa-folder"></i>
        //
        // < i
        // className = "far fa-file" > < / i >
        //
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

                    <div style={Styles.NODE_ICON} className={icon}>
                    </div>

                    <div style={Styles.NODE_NAME}>
                        {node.name}
                    </div>

                </div>

                <div style={{paddingLeft: '0.5em',
                             marginLeft: '0.5em',
                             borderLeft: '1px solid black'}}>
                    {children.map(child => <TreeNode key={idx++} node={child}/>)}
                </div>

            </div>

        );

    }

}

interface IProps {
    readonly node: TNode;
}

export interface TNode {

    readonly name: string;
    readonly children?: TNode[];

}

interface IState {
    readonly open: boolean;
}



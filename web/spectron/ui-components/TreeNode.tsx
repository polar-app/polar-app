import * as React from 'react';

export class TreeNode extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false
        };

    }

    public render() {

        const nodes = this.props.nodes || [];

        let idx = 0;
        //
        // <i className="fas fa-folder"></i>
        //
        // < i
        // className = "far fa-file" > < / i >
        //
        // const createIcon = () => {
        //     if (nodes.childre)
        // }

        return (

            <div style={{}}>

                {nodes.map(item =>
                   <div key={idx++}>
                       {item.name}

                       <div style={{marginLeft: '1em'}}>
                           <TreeNode nodes={item.children}/>
                       </div>

                   </div>)}

            </div>

        );

    }

}

interface IProps {
    readonly nodes?: TNode[];
}

export interface TNode {

    readonly name: string;
    readonly children?: TNode[];

}

interface IState {
    readonly open: boolean;
}



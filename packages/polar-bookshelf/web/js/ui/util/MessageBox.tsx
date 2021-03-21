import * as React from 'react';

export class MessageBox extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const width = this.props.width || 600;

        const position = this.props.position || 'bottom';

        const style: React.CSSProperties = {
            position: 'fixed',
            zIndex: 999999999999999,
            width: '100%'
        };

        switch (position) {
            case "bottom":
                style.bottom = '25px';
                break;
            case "top":
                style.top = '25px';
                break;
        }

        return <div style={style}>

            <div style={{
                     width:  width + 'px',
                     marginLeft: 'auto',
                     marginRight: 'auto',
                     backgroundColor: 'var(--primary-background-color)'
                 }}
                 className="border rounded shadow p-3">

                {this.props.children}

            </div>

        </div>;

    }

}

interface IProps {
    readonly width?: number;
    readonly position?: 'bottom' | 'top';
}

interface IState {

}

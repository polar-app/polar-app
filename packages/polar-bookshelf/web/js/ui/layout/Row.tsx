import * as React from 'react';

export class Row extends React.PureComponent<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className={this.props.className}
                 id={this.props.id}
                 style={{
                     ...(this.props.style || {}),
                     display: 'flex',
                     flexDirection: 'row'
                 }}>

                {this.props.children}

            </div>
        );

    }

    static Main = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div className="react-row-main"
                     style={{
                         flexGrow: 1,
                         display: 'flex'
                     }}>

                    <div className="mt-auto mb-auto">
                        {this.props.children}
                    </div>

                </div>
            );
        }

    };

    static Left = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div className="mt-auto mb-auto"
                     style={{
                         display: 'flex'
                     }}>
                    {this.props.children}
                </div>
            );
        }

    };

    static Right = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div className="mt-auto mb-auto"
                     style={{
                        display: 'flex'
                     }}>
                    {this.props.children}
                </div>
            );
        }

    };

}

interface IProps {
    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

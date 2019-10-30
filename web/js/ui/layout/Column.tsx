import * as React from 'react';

export class Column extends React.PureComponent<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div style={{
                     display: 'flex',
                     flexDirection: 'column'
                 }}>

                {this.props.children}

            </div>
        );
    }

    static Main = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div style={{flexGrow: 1}}>
                    {this.props.children}
                </div>
            );
        }

    };

    static Header = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div style={{}}>
                    {this.props.children}
                </div>
            );
        }

    };

    static Footer = class extends React.PureComponent<any, any>{

        public render() {

            return (

                <div style={{}}>
                    {this.props.children}
                </div>
            );
        }

    };

}

interface IProps {

}

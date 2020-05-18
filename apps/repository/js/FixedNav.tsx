import * as React from 'react';
import {Props} from "../../../web/js/react/Props";

export class FixedNav extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {
        return (

            <div {...(this.props.id ? {id: this.props.id} : {})}
                 {...(this.props.className ? {className: this.props.className} : {})}
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     flexGrow: 1,
                     minWidth: 0,
                     minHeight: 0,
                 }}>

                {this.props.children}

            </div>

        );
    }

    public static Header = class extends React.Component<IProps> {

        public render() {

            const style = {
                width: '100%'
            };

            const props = Props.merge(this.props, {style});

            return (

                <div {...props}>

                    {this.props.children}

                </div>

            );
        }

    };
    public static Body = class extends React.Component<IProps> {

        public render() {

            const style = {
                display: 'flex',
                flexGrow: 1,
                minHeight: 0,
                minWidth: 0,
            };

            const props = Props.merge(this.props, {style});

            return (

                <div {...props}>

                    {this.props.children}

                </div>

            );
        }

    };

    public static Footer = class extends React.Component<IProps> {

        public render() {

            return (

                <div {...(this.props.id ? {id: this.props.id} : {})}
                     {...(this.props.className ? {className: this.props.className} : {})}
                     style={{
                         width: '100%'
                     }}>

                    {this.props.children}

                </div>

            );
        }

    };

}

export class FixedNavBody extends React.Component<IProps> {

    public render() {

        return (

            <div {...(this.props.id ? {id: this.props.id} : {})}
                 {...(this.props.className ? {className: this.props.className} : {})}
                 style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    height: '100%',
                    width: '100%',
                     ...this.props.style
                 }}>

                {this.props.children}

            </div>

        );
    }

}

export interface IProps {
    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}


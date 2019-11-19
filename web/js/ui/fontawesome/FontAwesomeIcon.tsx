import * as React from 'react';

export class FontAwesomeIcon extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const style = {
            width: '20px',
            marginLeft: '0.3rem',
            marginRight: '0.3rem'
        };

        if (this.props.name) {
            return <i className={this.props.name} style={style}/>;
        } else {
            return <span style={style}></span>
        }


    }

}

export interface IProps {

    /**
     * The name of the font awesome icon to use.  If non is specified just a blank spacer icon is used.
     */
    readonly name?: string;
}

interface IState {

}

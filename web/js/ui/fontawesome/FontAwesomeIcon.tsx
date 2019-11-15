import * as React from 'react';

export class FontAwesomeIcon extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return <i className={this.props.name}
                  style={{
                      width: '20px',
                      marginLeft: '0.3rem',
                      marginRight: '0.3rem'
                  }}/>;

    }

}

export interface IProps {

    /**
     * The name of the font awesome icon to use.
     */
    readonly name: string;
}

interface IState {

}

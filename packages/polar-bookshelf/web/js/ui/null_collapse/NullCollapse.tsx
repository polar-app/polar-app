import React from 'react';


/**
 * A simple collapse that just renders a null component when not open.
 */
export class NullCollapse extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }


    public render() {

        if (this.props.open) {
            return this.props.children;
        } else {
            return null;
        }

    }

}

interface IProps {

    readonly open?: boolean;

}

interface IState {


}

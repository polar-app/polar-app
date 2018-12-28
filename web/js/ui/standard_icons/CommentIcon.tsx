import * as React from 'react';
import {Button} from 'reactstrap';
import {HighlightColor} from '../../metadata/BaseHighlight';
import {IStyleMap} from '../../react/IStyleMap';

const Styles: IStyleMap = {

    icon: {
        fontSize: '16px',
        color: '#a4a4a4',
        width: '16px'
    }
};

/**
 */
export class CommentIcon extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <i style={Styles.icon} className="fas fa-comment-alt"></i>

        );

    }

}

interface IProps {
}

interface IState {
}

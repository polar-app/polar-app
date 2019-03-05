import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import Button from 'reactstrap/lib/Button';

/**
 */
export class EditButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button id={this.props.id}
                    className="text-muted"
                    size="sm"
                    color="light"
                    title={'Edit ' + this.props.type}
                    onClick={() => this.onClick()}>

                <div style={{
                    display: 'flex'
                }}>

                    <div style={{
                        width: '22px',
                        display: 'flex'
                    }}>
                        <i className="far fa-edit"
                           style={{
                               fontSize: '20px',
                               margin: 'auto',
                           }}></i>

                    </div>

                </div>

            </Button>
        );

    }

    private onClick() {

        RendererAnalytics.event({category: 'annotation-edit', action: this.props.type});
        this.props.onClick();

    }

}

interface IProps {
    /**
     * Called when the button is clicked.
     */
    readonly id: string;
    readonly onClick: () => void;
    readonly type: 'comment' | 'flashcard';
}

interface IState {

}

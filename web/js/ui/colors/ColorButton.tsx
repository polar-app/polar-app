import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

export class ColorButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const {props} = this;

        const createBackgroundColor = () => {

            switch (props.color) {

                case 'yellow':
                    return 'rgba(255,255,0)';
                case 'red':
                    return 'rgba(255,0,0)';
                case 'green':
                    return 'rgba(0,255,0)';
                default:
                    return props.color;
            }

        };

        const backgroundColor = createBackgroundColor();

        const onSelected = props.onSelected || NULL_FUNCTION;

        const size = props.size || '30px';

        const border = this.props.selected ?
            '1pt solid var(--primary)' :
            '1pt solid rgba(0, 0, 0, 0.1)';

        return <div className="ml-1 mr-1"
                    style={{
                        display: 'flex',
                    }}>
            <button id={props.id}
                    className={"p-0"}
                    title=""
                    aria-label=""
                    onClick={() => onSelected(props.color)}
                    style={{
                        backgroundColor,
                        border,
                        width: size,
                        height: size
                    }}>

            </button>
        </div>;

    }

}

interface IProps {
    readonly color: RGBColor;
    readonly size?: string;
    readonly id?: string;
    readonly selected?: boolean;
    readonly onSelected?: (color: string) => void;
}

interface IState {
}

/**
 * RGB color in the a CSS color.
 */
export type RGBColor = string;

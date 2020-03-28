import * as React from 'react';
import {ColorButton} from './ColorButton';

interface ColorButtonsRowProps extends IProps {
    readonly colors: ReadonlyArray<string>;
}

const ColorButtonsRow = (props: ColorButtonsRowProps) => {

    const selected = props.selected || [];

    return <div style={{display: 'flex'}}>
        {props.colors.map(color =>
          <ColorButton key={color}
                       selected={selected.includes(color)}
                       onSelected={props.onSelected}
                       color={color}/>)}
    </div>;

};

const ColorButtonsRow0 = (props: IProps) => {

    const colors = ['yellow', 'red', 'green', '#9900EF', '#FF6900'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow1 = (props: IProps) => {

    const colors = ['#8DFF76', '#00D084', '#8ED1FC', '#0693E3', '#EB144C'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow2 = (props: IProps) => {
    const colors = ['#F78DA7', '#FFFF00', '#F96676', '#FCB900', '#7BDCB5'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtons = (props: IProps) => {

    return <div className="pt-1 pb-1"
                style={{
                }}>

        <ColorButtonsRow0 {...props}/>

        <div className="mt-2">
            <ColorButtonsRow1 {...props}/>
        </div>

        <div className="mt-2">
            <ColorButtonsRow2 {...props}/>
        </div>

    </div>;

};

export class ColorSelectorBox extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false
        };

    }

    private deactivate() {

        this.setState({
            open: false
        });
    }

    private activate() {

        this.setState({
            open: true
        });
    }

    public render() {

        const props = this.props;

        return (
            <div>

                <ColorButtons {...props}/>

            </div>
        );

    }
}


export type ColorStr = string;

interface IProps {

    readonly selected?: ReadonlyArray<ColorStr>;

    readonly onSelected?: (color: ColorStr) => void;

    // readonly clearable?: boolean;

}

interface IState {
    readonly open: boolean;
}

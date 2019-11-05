import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {ColorButton} from './ColorButton';

interface ColorButtonsRowProps extends IProps {
    readonly colors: ReadonlyArray<string>;
}

const ColorButtonsRow = (props: ColorButtonsRowProps) => {

    const selectedColors = props.selectedColors || [];

    return <div style={{display: 'flex'}}>
        {props.colors.map(color =>
          <ColorButton selected={selectedColors.includes(color)} key={color} {...props} color={color}/>)}
    </div>;

};

const ColorButtonsRow0 = (props: IProps) => {

    const colors = ['yellow', 'red', 'green', '#FFFF00', '#F96676'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow1 = (props: IProps) => {

    const colors = ['#8DFF76', '#00D084', '#8ED1FC', '#0693E3', '#EB144C'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow2 = (props: IProps) => {

    const colors = ['#F78DA7', '#9900EF', '#FF6900', '#FCB900', '#7BDCB5'];

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

        {/*<div className="mt-1">*/}
        {/*    <div style={{display: 'flex'}}>*/}

        {/*        <Button size="sm"*/}
        {/*                color="secondary"*/}
        {/*                className="ml-auto mr-auto" outline>*/}
        {/*            reset*/}
        {/*        </Button>*/}

        {/*    </div>*/}
        {/*</div>*/}

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

    readonly selectedColors?: ReadonlyArray<ColorStr>;

    readonly onSelected?: (color: ColorStr) => void;

    // readonly clearable?: boolean;

}

interface IState {
    readonly open: boolean;
}

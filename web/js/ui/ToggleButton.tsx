import * as React from 'react';
import Button from 'reactstrap/lib/Button';

export class ToggleButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {value: this.props.initialValue !== undefined ? this.props.initialValue : false};

        this.toggle = this.toggle.bind(this);

    }

    public render() {

        const createIconClassName = () => {

            if (this.props.iconClassName) {
                return this.props.iconClassName;
            }

            if (this.state.value) {
                return 'fas fa-check';
            } else {
                return 'fas fa-minus';
            }

        };

        const bgClassName = this.state.value ? 'bg-primary' : 'bg-secondary';
        const iconClassName = createIconClassName();;

        return (

            <Button id={this.props.id || ""}
                    color="light p-0 pr-0 border rounded"
                    onClick={() => this.toggle()}
                    size="sm">

                <div style={{display: 'flex'}}>

                    <div className={bgClassName + " p-1 text-light rounded-left"}
                         style={{verticalAlign: 'middle', textAlign: 'center', width: '2.5em'}}>

                        &nbsp;<i className={iconClassName}></i>&nbsp;

                    </div>

                    <div className="p-1 pr-2 d-none-mobile"
                         style={{verticalAlign: 'middle'}}>
                        &nbsp;{this.props.label}
                    </div>

                </div>

            </Button>

        );
    }

    public toggle() {

        const value = !this.state.value;
        this.setState({...this.state, value});

        this.props.onChange(value);

    }


}


interface IProps {
    readonly id?: string;
    readonly initialValue?: boolean;
    readonly label: string;
    readonly iconClassName?: string;
    readonly onChange: (value: boolean) => void;
}

interface IState {

    readonly value: boolean;

}



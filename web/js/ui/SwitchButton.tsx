import * as React from 'react';
import Button from 'reactstrap/lib/Button';

export class SwitchButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {value: this.props.initialValue !== undefined ? this.props.initialValue : false};

        this.toggle = this.toggle.bind(this);

    }

    public render() {

        const createIconClassName = () => {

            if (this.state.value) {
                return 'fas fa-toggle-on text-primary';
            } else {
                return 'fas fa-toggle-off text-secondary';
            }

        };

        const iconClassName = createIconClassName();

        return (

            <Button id={this.props.id || ""}
                    color="clear"
                    className="btn-no-outline p-0"
                    onClick={() => this.toggle()}
                    size={this.props.size  || 'sm'}>

                <i className={iconClassName}/>

            </Button>

        );
    }

    public toggle() {

        const value = ! this.state.value;

        this.setState({value});

        this.props.onChange(value);

    }


}


interface IProps {
    readonly id?: string;
    readonly initialValue?: boolean;
    readonly onChange: (value: boolean) => void;
    readonly size?: 'sm' | 'md' | 'lg';
}

interface IState {

    readonly value: boolean;

}



import * as React from 'react';
import {Input, Label, ListGroup, ListGroupItem} from 'reactstrap';
import {IStyleMap} from '../../js/react/IStyleMap';

const Styles: IStyleMap = {

    Label: {
        userSelect: 'none',
        width: '100%',
        cursor: 'pointer',
        marginBottom: '0'

    },

};

export class ListSelector<T extends ListOptionType> extends React.Component<IProps<T>, IState> {

    constructor(props: IProps<T>, context: any) {
        super(props, context);

        this.onChange = this.onChange.bind(this);
        this.state = {
            // dropdownOpen: false,
            // splitButtonOpen: false
        };

    }

    public render() {

        return (
            <div className="column-selector m-0" id={this.props.id}>

                <ListGroup flush>

                    {this.createListGroupItems(this.props.options)}

                </ListGroup>

            </div>
        );

    };

    private createListGroupItems(options: T[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

        // TODO: I'm not sure what type of class a <div> or React element uses
        // so using 'any' for now.

        const result: any = [];

        options.map(option => {
            const id = this.props.id + '-' + option.id;
            result.push (
                <ListGroupItem key={option.id}>

                    <div className="ml-2">

                        <Input type="checkbox"
                               id={id}
                               defaultChecked={option.selected}
                               onChange={(event) => this.onChange(option, event)}/>

                        <Label for={id} style={Styles.Label}>{option.label}</Label>

                    </div>

                </ListGroupItem>);
        });

        return result;

    }

    private onChange(option: T, event: React.ChangeEvent<HTMLInputElement>) {

        this.props.onChange({
            id: option.id,
            label: option.label,
            selected: event.target.checked
        });

        // console.log("Changed", event.target.checked);

    }

}

export interface ListOptionType {

    /**
     * The ID of the option.
     */
    id: string;

    /**
     * The label to show in the UI.
     */
    label: string;

    /**
     * True when the option is selected by the user.
     */
    selected: boolean;

}

interface IProps<T> {

    id: string;

    options: T[];

    /**
     * Called when a value changes.
     */
    onChange: (value: ListOptionType) => void;

}

interface IState {

}

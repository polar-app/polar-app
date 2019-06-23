import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {ContactIDStr} from '../../datastore/sharing/db/Contacts';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class ContactsSelector extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            options: this.props.options || [],
            selectedOptions: this.props.selectedOptions || []
        };

    }

    public render() {

        function convertToOptions(contacts: ReadonlyArray<ContactOption>) {
            return contacts.map(current => {
                return {
                    value: current.value,
                    label: current.label
                };
            });
        }

        const options = convertToOptions(this.state.options);
        const selectedOptions = convertToOptions(this.state.selectedOptions);

        return <div>
            <CreatableSelect
                isMulti
                isClearable
                autoFocus
                // onKeyDown={event => this.onKeyDown(event)}
                // className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOptions) => this.handleChange(selectedOptions as ReadonlyArray<ContactOption>)}
                value={selectedOptions}
                defaultValue={selectedOptions}
                placeholder="Enter names or email addresses"
                options={options}>

            </CreatableSelect>

        </div>;

    }

    private handleChange(selectedOptions: ReadonlyArray<ContactOption>) {
        console.log(selectedOptions);

        this.setState({...this.state, selectedOptions});
    }

}

interface IProps {
    readonly options?: ReadonlyArray<ContactOption>;
    readonly selectedOptions?: ReadonlyArray<ContactOption>;
}

interface IState {
    readonly options: ReadonlyArray<ContactOption>;
    readonly selectedOptions: ReadonlyArray<ContactOption>;
}

export interface ContactOption {
    readonly value: ContactIDStr;
    readonly label: string;
}

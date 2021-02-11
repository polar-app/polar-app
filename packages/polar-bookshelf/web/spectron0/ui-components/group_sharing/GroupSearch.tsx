import * as React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from "@material-ui/core/InputLabel";

export class GroupSearch extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <InputLabel htmlFor="searchByTagOrName">Find groups:</InputLabel>
                <Input type="text"
                       name="searchByTagOrName"
                       id="searchByTagOrName"
                       placeholder="Search by tag or name" />

            </div>

        );
    }

}


interface IProps {
}

interface IState {

}

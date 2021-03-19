import * as React from 'react';
import Button from '@material-ui/core/Button';

export function GroupHit(props: IProps) {

    return (

        <tr className="" style={{display: 'table-row'}}>

            <td>
                {props.name}
            </td>

            <td>
                {props.description}
            </td>

            <td className="text-right">
                {props.nrMembers}
            </td>

            <td>

                <Button color="primary"
                        variant="contained"
                        className="ml-1"
                        onClick={() => props.onAdd()}>
                    Add
                </Button>

            </td>

        </tr>

    );
}


interface IProps {
    readonly name: string;
    readonly description: string;
    readonly nrMembers: number;
    readonly onAdd: () => void;
}

interface IState {

}

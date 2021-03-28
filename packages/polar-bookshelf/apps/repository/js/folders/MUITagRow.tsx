import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {MUIEfficientCheckbox} from "./MUIEfficientCheckbox";
import isEqual from "react-fast-compare";

interface IProps {
    readonly selected: boolean;
    readonly nodeId: string;
    readonly label: string;
    readonly info: string | number;
}

export const MUITagRow = React.memo(function MUITagRow(props: IProps) {
    return (
        <TableRow hover role="checkbox" tabIndex={-1}>
            <TableCell>
                <MUIEfficientCheckbox checked={true}/>
            </TableCell>
            <TableCell>
                {props.label}
            </TableCell>
            <TableCell>
                {props.info}
            </TableCell>
        </TableRow>
    );
}, isEqual);

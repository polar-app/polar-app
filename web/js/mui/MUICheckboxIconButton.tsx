import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary
        },
        active: {
            color: theme.palette.secondary.main
        }
    }),
);

// needed because the Checkbox icon doesn't look the same as the other ones...

interface IProps {
    readonly indeterminate?: boolean;
    readonly checked?: boolean;
    readonly onChange: (event: React.MouseEvent, clicked: boolean) => void;

}

export const MUICheckboxIconButton = React.memo(function MUICheckboxIconButton(props: IProps) {

    const classes = useStyles();
    const mode = props.indeterminate ? 'i' : props.checked ? 'c' : 'n';

    const className = mode === 'n' ? classes.root : classes.active;

    return (
        <IconButton className={className}
                    onClick={(event) => props.onChange(event, mode === 'n')}>
            {mode === 'i' && <IndeterminateCheckBoxIcon/>}
            {mode === 'c' && <CheckBoxIcon/>}
            {mode === 'n' && <CheckBoxOutlineBlankIcon/>}
        </IconButton>
    );

});

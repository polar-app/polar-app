import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";

interface IProps {
    readonly id?: string;
    readonly label?: string;
    readonly placeholder?: string;
    readonly initialValue?: string;
    readonly style?: React.CSSProperties;
    readonly onChange: (text: string) => void;
}

export const MUISearchBox2 = (props: IProps) => {

    // FIXME: need a debouncer here...
    const handleChange = (text: string) => {
        props.onChange(text);
    };

    return (
        <OutlinedInput startAdornment={(
                           <InputAdornment position="start">
                               <SearchIcon />
                           </InputAdornment>
                       )}
                       margin="dense"
                       type="search"
                       id={props.id}
                       style={props.style}
                       label={props.label}
                       defaultValue={props.initialValue}
                       placeholder={props.placeholder}
                       onChange={event => handleChange(event.currentTarget.value)}/>
    );
};

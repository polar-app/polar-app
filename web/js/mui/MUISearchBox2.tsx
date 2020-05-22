import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import isEqual from "react-fast-compare";

interface IProps {
    readonly id?: string;
    readonly label?: string;
    readonly placeholder?: string;
    readonly value?: string;
    readonly initialValue?: string;
    readonly className?: string;
    readonly autoFocus?: boolean;
    readonly style?: React.CSSProperties;
    readonly onChange: (text: string) => void;
    readonly ref?: React.Ref<unknown>;
}

export const MUISearchBox2 = React.memo((props: IProps) => {

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
                       autoFocus={props.autoFocus}
                       id={props.id}
                       style={props.style}
                       label={props.label}
                       value={props.value}
                       defaultValue={props.initialValue}
                       placeholder={props.placeholder}
                       className={props.className}
                       ref={props.ref}
                       // ref={ref => console.log("FIXME0: " , ref)}
                       // inputRef={ref => console.log("FIXME1: " , ref)}
                       onChange={event => handleChange(event.currentTarget.value)}/>
    );
}, isEqual);

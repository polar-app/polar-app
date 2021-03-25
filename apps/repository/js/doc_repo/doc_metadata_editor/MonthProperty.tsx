import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Strings} from "polar-shared/src/util/Strings";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

export type Month = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

export type MonthSelect = Month | '';

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: Month | undefined;
    readonly onChange: (value: Month | undefined) => void;
}

function toMonthSelect(month: Month | undefined) {

    if (month === undefined) {
        return ''
    }

    return month;

}

function toMonth(month: MonthSelect): Month | undefined {

    if (month === '') {
        return undefined;
    }

    return month;

}

export const MonthProperty = deepMemo(function MonthProperty(props: IProps) {

    const label = props.label || Strings.upperFirst(props.name);

    const [value, setValue] = React.useState<MonthSelect>(toMonthSelect(props.value));

    const handleChange = React.useCallback((event: React.ChangeEvent<{ value: unknown }>) => {

        function eventValue(): MonthSelect {
            return event.target.value as MonthSelect;
        }

        const newValue = eventValue();
        setValue(newValue)
        props.onChange(toMonth(newValue));

    }, [props]);

    return (
        <div className={props.className}
             style={{
                 ...props.style,
             }}>

            <FormControl style={{flexGrow: 1, display: 'flex'}}>

                <InputLabel>{label}</InputLabel>

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={label}
                    value={value}
                    onChange={handleChange}>
                    <MenuItem value="jan">January</MenuItem>
                    <MenuItem value="feb">February</MenuItem>
                    <MenuItem value="mar">March</MenuItem>
                    <MenuItem value="apr">April</MenuItem>
                    <MenuItem value="may">May</MenuItem>
                    <MenuItem value="jun">June</MenuItem>
                    <MenuItem value="jul">July</MenuItem>
                    <MenuItem value="aug">August</MenuItem>
                    <MenuItem value="sep">September</MenuItem>
                    <MenuItem value="oct">October</MenuItem>
                    <MenuItem value="nov">November</MenuItem>
                    <MenuItem value="dec">December</MenuItem>
                    <MenuItem value="">not set</MenuItem>
                </Select>

                {props.description !== undefined && (
                    <div>
                        <FormHelperText>{props.description}</FormHelperText>
                    </div>
                )}

            </FormControl>

        </div>
    );
});

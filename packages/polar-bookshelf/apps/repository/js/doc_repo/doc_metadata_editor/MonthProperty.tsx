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

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onChange: (value: string) => void;
}

export const MonthProperty = deepMemo((props: IProps) => {

    const label = props.label || Strings.upperFirst(props.name);

    const handleChange = React.useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        props.onChange(event.target.value as string);
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
                    value={props.value}
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

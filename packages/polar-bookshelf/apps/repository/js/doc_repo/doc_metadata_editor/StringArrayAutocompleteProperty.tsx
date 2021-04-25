import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import { Strings } from "polar-shared/src/util/Strings";
import MUICreatableAutocomplete, {ValueAutocompleteOption} from "../../../../../web/js/mui/autocomplete/MUICreatableAutocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly values: ReadonlyArray<string> | undefined;
    readonly onChange: (values: ReadonlyArray<string>) => void;
}

export const StringArrayAutocompleteProperty = deepMemo(function StringArrayAutocompleteProperty(props: IProps) {

    const options = React.useMemo((): ReadonlyArray<ValueAutocompleteOption<string>> => {

        if (props.values === undefined || props.values === null) {
            return [];
        }

        return (props.values).map(current => ({
            id: current,
            label: current,
            value: current
        }));

    }, [props]);

    const createOption = React.useCallback((label): ValueAutocompleteOption<string> => {
        return {
            id: label,
            label,
            value: label
        }
    }, []);

    const label = props.label || Strings.upperFirst(props.name);

    return (
        <div className={props.className}
             style={{
                 ...props.style,
             }}>
            <div style={{display: 'flex'}}>
                <MUICreatableAutocomplete options={options}
                                          label={label}
                                          style={{flexGrow: 1}}
                                          placeholder={options.length === 0 ? label : undefined}
                                          defaultOptions={options}
                                          createOption={createOption}
                                          onChange={props.onChange}/>
            </div>
            {props.description !== undefined && (
                <div>
                    <FormHelperText>{props.description}</FormHelperText>
                </div>
            )}
      </div>
    );
});

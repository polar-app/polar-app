import {useLogger} from "../../../../../web/js/mui/MUILogger";
import * as React from "react";
import {PreviewWarning} from "./PreviewWarning";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly options: ReadonlyArray<IOption>;
    readonly preview?: boolean;
}

interface IOption {
    readonly id: string;
    readonly label: string;
}

export const SettingSelect = (props: IProps) => {

    const log = useLogger();
    const prefs = usePrefsContext();

    const {name} = props;

    const onChange = (value: string) => {
        console.log("Setting " + name);

        prefs.set(props.name, value);

        const doCommit = async () => {
            await prefs.commit();
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };

    const value = prefs.get(props.name)
                       .getOrElse(props.options[0].id);

    return (
        <div>
            <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto"
                     style={{flexGrow: 1}}>
                    <h2><b>{props.title}</b></h2>
                </div>

                <div className="mt-auto mb-auto">

                    <Select value={value}
                            onChange={event => onChange(event.target.value as string)}>

                        {props.options.map(current =>
                           <MenuItem key={current.id} value={current.id}>
                               {current.label}
                           </MenuItem>)}

                    </Select>

                </div>

            </div>

            <div>
                <p style={{fontSize: '1.3rem'}}>
                    {props.description}
                </p>
            </div>

            {props.preview && <PreviewWarning/>}

        </div>
    );

};

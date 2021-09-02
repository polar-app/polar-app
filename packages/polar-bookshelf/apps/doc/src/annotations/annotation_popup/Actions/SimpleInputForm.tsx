import {Box, Button, createStyles, makeStyles, TextField} from "@material-ui/core";
import clsx from "clsx";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import React from "react";
import {InputCompleteListener} from "../../../../../../web/js/mui/complete_listeners/InputCompleteListener";

export const useStyles = makeStyles((theme) => {
    const { palette: { background: { paper } } } = theme;
    return createStyles({
        textFieldOuter: {
            "& + &": { marginTop: 10 }
        },
        textField: {
            background: paper,
            borderColor: paper,
            "& fieldset": {
                borderColor: paper,
            }
        },
    });
});

export type FieldValues = Record<string, any>;
export type FormState<T extends FieldValues = FieldValues> = {
    [K in keyof T]: T[K]
};

export type InputOption<T> = { placeholder?: string, initialValue?: T, rows?: number, ref?: React.Ref<HTMLInputElement> };

export type InputOptions<T extends FieldValues = FieldValues> = {
    [K in keyof T]: InputOption<T[K]>;
};


type ISimpleInputFormProps<T extends FieldValues = FieldValues> = {
    inputs: InputOptions<T>;
    onSubmit: (data: FormState<T>) => void;
    onCancel?: () => void;
    footer?: React.ReactElement;
    className?: string;
    style?: React.CSSProperties;
};

export function SimpleInputForm<
    T extends FieldValues = FieldValues
>({
    inputs,
    onSubmit,
    onCancel = NULL_FUNCTION,
    footer,
    className = "",
    style = {},
}: React.PropsWithChildren<ISimpleInputFormProps<T>>): React.ReactElement {
    const classes = useStyles();
    const [values, setValues] = React.useState<T>(
        Object.keys(inputs).reduce((acc, key) =>
            ({ ...acc, [key]: inputs[key].initialValue || "" }), {}) as T
    );

    React.useEffect(() => {
        const newValues = Object.keys(inputs).reduce((acc, key) =>
            ({ ...acc, [key]: inputs[key].initialValue || "" }), {}) as T
        setValues(newValues);
    }, [inputs]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(({ target } ) => {
        setValues((values) => ({ ...values, [target.name]: target.value }));
    }, []);

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        onSubmit(values);
    };

    const invalid = Object.keys(values).some(key => values[key].trim().length === 0);

    return (
        <form onSubmit={handleSubmit} style={style} className={clsx(className, "p-3")}>
            <Box display="flex" flexDirection="column">
                {Object.keys(inputs).map((key, i) => (
                    <div key={key} className={classes.textFieldOuter}>
                        <InputCompleteListener
                            type="meta+enter"
                            onComplete={handleSubmit}
                            onCancel={onCancel}
                            noHint
                        >
                            <TextField
                                multiline
                                autoFocus={i === 0}
                                name={key}
                                inputRef={inputs[key].ref}
                                variant="outlined"
                                rows={inputs[key].rows || 2}
                                rowsMax={5}
                                placeholder={inputs[key].placeholder}
                                className={classes.textField}
                                value={values[key]}
                                onChange={handleChange}
                                fullWidth
                            />
                        </InputCompleteListener>
                    </div>
                ))}
            </Box>

            <Box display="flex" justifyContent="space-between" mt={2}>
                <div>{footer}</div>
                <Button color="primary"
                        type="submit"
                        disabled={invalid}
                        variant="contained">
                    Save
                </Button>
            </Box>
        </form>
    );
};

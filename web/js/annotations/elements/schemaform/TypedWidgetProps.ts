
// https://github.com/mozilla-services/react-jsonschema-form#custom-widgets-and-fields
//
// The following props are passed to custom widget components:
//
// id: The generated id for this field;
// schema: The JSONSchema subschema object for this field;
// value: The current value for this field;
// required: The required status of this field;
// disabled: true if the widget is disabled;
// readonly: true if the widget is read-only;
// onChange: The value change event handler; call it with the new value everytime it changes;
// onBlur: The input blur event handler; call it with the the widget id and value;
// onFocus: The input focus event handler; call it with the the widget id and value;
// options: A map of options passed as a prop to the component (see Custom widget options).
// formContext: The formContext object that you passed to Form.

export class TypedWidgetProps {

    public readonly id?: string;

    public readonly value?: string;

    public readonly required?: boolean;

    public readonly readonly?: boolean;

    public readonly disabled?: boolean;

    constructor(val: any) {
        Object.assign(this, val);
    }

}

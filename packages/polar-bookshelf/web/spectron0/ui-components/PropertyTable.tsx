import * as React from 'react';

export class PropertyTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <table className="">
                <tbody>
                    {this.props.children}
                </tbody>
            </table>

        );

    }

    public static Row = class extends React.Component<IRowProps, any> {

        public render() {

            if (this.props.value === undefined) {
                return [];
            }

            const value = Values.toStr(this.props.value);

            return (

                <tr>

                    <td className="font-weight-bold text-grey800 pt-1 pr-1">
                        {this.props.name}:
                    </td>

                    <td className="pt-1">

                        <div style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {value}
                        </div>

                    </td>

                </tr>

            );

        }

    };

    /**
     * Text block of multi-line / long form text like a description that needs to reflow.
     */
    public static Text = class extends React.Component<IRowProps, any> {

        public render() {

            if (this.props.value === undefined) {
                return [];
            }

            const value = Values.toStr(this.props.value);

            return (

                <tr>

                    <td colSpan={2} className="pt-1">

                        <div className="font-weight-bold text-grey800 ">
                            {this.props.name}:
                        </div>

                        <p>
                        {value}
                        </p>

                    </td>

                </tr>

            );

        }

    };

}

class Values {

    public static toStr(value: string | ReadonlyArray<string> | undefined) {
        if (typeof value === 'string') {
            return value;
        } else if (Array.isArray(value)) {
            return value.join(", ");
        } else {
            return "";
        }

    }

}


interface IProps {

}

interface IState {

}


interface IRowProps {

    /**
     * The name of the title if one is optional.
     */
    readonly name: string;

    readonly value: string | ReadonlyArray<string> | undefined;

}

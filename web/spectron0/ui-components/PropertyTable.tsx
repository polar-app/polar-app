import * as React from 'react';

export class PropertyTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <table className="">
                {this.props.children}
            </table>

        );

    }

    static Row = class extends React.Component<IRowProps, any> {

        public render() {

            if (this.props.value === undefined) {
                return <div/>;
            }

            const toValue = () => {

                if (typeof this.props.value === 'string') {
                    return this.props.value;
                } else if (Array.isArray(this.props.value)) {
                    return this.props.value.join(", ");
                } else {
                    return "";
                }

            };

            const value = toValue();

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

}

interface IProps {

}

interface IState {

}


interface IRowProps {
    readonly name: string;
    readonly value: string | ReadonlyArray<string> | undefined;
}

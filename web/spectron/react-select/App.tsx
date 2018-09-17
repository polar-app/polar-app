import * as React from 'react';
import Select from 'react-select';


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]
class App<P> extends React.Component<{}, IAppState> {


    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {
        return (

            <div id="myapp">

                <Select
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable={true}
                    options={options} />

            </div>

        );
    }
}

export default App;

interface IAppState {


}

import * as React from 'react';
import {Button} from "reactstrap";
import {AnnotationPreview} from "../annotation_repo/AnnotationPreview";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export class Reviewer extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div>

                <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                     }}>

                    <div>
                        {/*P<Progress bar value={50} color="success" className="w-100"/>*/}

                        <progress value={50}/>

                    </div>

                    <div className="p-1"
                         style={{
                            flexGrow: 1
                         }}>

                        <AnnotationPreview id="101"
                                           text="This is an example annotation.  There are many like it but this one is mine"
                                           created={ISODateTimeStrings.create()}
                                           meta={{color: 'yellow'}}
                        />

                        <div className="text-center">
                            <Button color="danger" className="m-1">Again</Button>
                            <Button color="secondary" className="m-1">Good</Button>
                            <Button color="success" className="m-1">Easy</Button>
                        </div>

                    </div>

                </div>

            </div>

        );
    }

}

export interface IProps {

}

export interface IState {

}

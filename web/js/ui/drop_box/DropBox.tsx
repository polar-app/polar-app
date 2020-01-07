import * as React from 'react';
import {Button} from "reactstrap";

interface IProps {
    readonly active?: boolean;
    readonly style?: React.CSSProperties;
}

export const DropBox = (props: IProps) => {

    const color = props.active ? 'var(--primary)' : 'var(--grey300)';

    return (
        <div className="rounded"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 border: `2px dashed ${color}`,
                 ...(props.style ?? {})
             }}>


            <div className="m-auto text-center">
                <i className="fas fa-cloud-upload-alt" style={{fontSize: '125px', color}}/>

                <h4>Drag and Drop to Upload</h4>

                <div className="mt-3">
                    <Button size="lg" color="primary">Browse Files</Button>
                </div>

            </div>

        </div>
    );

};

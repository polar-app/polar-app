import * as React from 'react';

interface IProps {
    readonly active?: boolean;
    readonly style?: React.CSSProperties;
}

export const DropBox = (props: IProps) => {

    const color = props.active ? 'var(--primary)' : 'var(--secondary)';

    return (
        <div className="rounded"
             style={{
                 display: 'flex',
                 border: `2px dashed ${color}`,
                 ...(props.style ?? {})
             }}>

            <div className="m-auto m-5">
                <i className="fas fa-cloud-upload-alt text-primary" style={{fontSize: '150px'}}/>
            </div>

        </div>
    );

};

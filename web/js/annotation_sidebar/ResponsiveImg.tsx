import * as React from 'react';
import {Logger} from '../logger/Logger';
import {Img} from '../metadata/Img';
import {HighlightColor} from '../metadata/BaseHighlight';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ResponsiveImg extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {img, id, color} = this.props;

        const key = 'area-highlight' + id;


        if (img) {
            const width = Math.floor(img.width);
            const height = Math.floor(img.height);

            return (

                // TODO: we need the ability to scroll to the most recent
                // annotation that is created but I need a functional way to do
                // this because how do I determine when it loses focus?

                <div className="area-highlight m-1"
                     data-annotation-id={id}
                     data-annotation-color={color}
                     style={{
                        display: 'block',
                        textAlign: 'center',
                        position: 'relative'

                     }}>

                    <img style={{

                             // core CSS properties for the image so that it
                             // is responsive.

                             width: '100%',
                             height: 'auto',
                             objectFit: 'contain',
                             maxWidth: width,
                             maxHeight: height,

                             // border around the image

                             boxSizing: 'content-box',
                             border: `1px solid #c6c6c6`,

                         }}
                         className=""
                         width={width}
                         height={height}
                         alt="screenshot"
                         src={img.src}/>

                </div>

            );
        } else {
            return (
                <div key={key} className='area-highlight'>
                    No image
                </div>
            );
        }

    }

}
interface IProps {
    readonly id: string;
    readonly img?: Img;
    readonly color?: HighlightColor;
}

interface IState {
}


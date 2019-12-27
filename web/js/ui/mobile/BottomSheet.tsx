import * as React from 'react';
import {SlideFromBottom} from "../spring/SlideFromBottom";
import { FadeIn } from '../spring/FadeIn';

/**
 * A sheet anchored to the bottom of the page.
 */
export class BottomSheet extends React.Component<IProps> {

    public render() {

        const zIndex = 2000000;

        const onCancel = () => {
            console.log("cancel");
            window.history.back();
        };

        // TODO: make this a transition so it floats up from the bottom.
        return (

            <div style={{overflow: 'hidden'}}>
                 <div className="bottom-sheet-blackout"
                         style={{
                             position: 'absolute',
                             top: 0,
                             left: 0,
                             zIndex: zIndex - 1,
                             width: '100%',
                             height: '100%',
                             backgroundColor: 'rgba(0, 0, 0, 0.7)',
                         }}
                         onClick={() => onCancel()}>

                 </div>

                <div className=""
                                 style={{
                                     position: 'absolute',
                                     bottom: 0,
                                     left: 0,
                                     zIndex,
                                     width: '100%',
                                     backgroundColor: 'var(--primary-background-color)',
                                 }}>

                    {this.props.children}

                </div>

            </div>

            //
            // <div style={{
            //          position: 'absolute',
            //          top: 0,
            //          left: 0,
            //          width: '100%',
            //          height: '100%',
            //          zIndex,
            //          display: 'flex',
            //          flexDirection: 'column',
            //          overflow: 'none'
            //      }}>
            //
            //     <FadeIn className="bottom-sheet-blackout"
            //             style={{
            //                 flexGrow: 1,
            //                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
            //             }}
            //             onClick={() => window.history.back()}>
            //
            //     </FadeIn>
            //
            //     <SlideFromBottom className=""
            //                      style={{
            //                          width: '100%',
            //                          backgroundColor: 'var(--primary-background-color)',
            //                      }}>
            //
            //         {this.props.children}
            //
            //     </SlideFromBottom>
            //
            // </div>

        );

    }

}

export interface IProps {
}


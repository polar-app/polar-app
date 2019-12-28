import * as React from 'react';
import {SlideFromBottom} from "../motion/SlideFromBottom";
import {FadeBlackout} from "../motion/FadeBlackout";

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

                <FadeBlackout style={{zIndex: zIndex - 1}} onClick={() => onCancel()}/>

                <SlideFromBottom style={{
                                     position: 'absolute',
                                     bottom: 0,
                                     left: 0,
                                     zIndex,
                                     width: '100%',
                                     backgroundColor: 'var(--primary-background-color)',
                                 }}>

                    {this.props.children}

               </SlideFromBottom>

            </div>

        );

    }

}

export interface IProps {
}


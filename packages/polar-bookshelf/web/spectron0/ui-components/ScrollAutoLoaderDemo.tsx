import * as React from "react";
import {ScrollAutoLoader} from "./ScrollAutoLoader";

export const ScrollAutoLoaderDemo = () => {

    let containment: any;

    console.log("FIXME: containment: ", containment);

    return (
        <div style={{
            // display: 'flex',
            // flexDirection: "column",
            // flexGrow: 1,
            // overflow: 'auto',
            // margin: '100px'
        }}
             id="containment"
             ref={ref => containment = ref}>

            {/*<div style={{height: '2000px'}}>*/}

            {/*</div>*/}

            {/*<div style={{height: '2000px'}}>*/}

            {/*</div>*/}

            <ScrollAutoLoader defaultHeight={170} containment={containment}>
                <p className="border">
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                    this is some long text. this is some long text. this is some
                    long text.
                </p>
            </ScrollAutoLoader>

            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
            <ScrollAutoLoader defaultHeight={170}>
                <p className="border">
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                    this is some long text. this is some long text. this is some long text.
                </p>
            </ScrollAutoLoader>
        </div>
    );
};

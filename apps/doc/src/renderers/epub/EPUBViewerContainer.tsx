import React from 'react';
import {useDocViewerStore} from "../../DocViewerStore";
import {memoForwardRef} from "../../../../../web/js/react/ReactUtils";

interface IProps {
    readonly children: React.ReactNode;
}

export const EPUBViewerContainer = memoForwardRef((props: IProps) => {

    const {page} = useDocViewerStore(['page']);

    return (
        <main id="viewerContainer"
              style={{
                  position: 'absolute',
                  overflow: 'auto',
                  top: '0',
                  width: '100%',
                  height: '100%',
                  overflowX: 'hidden',
              }}
              itemProp="mainContentOfPage">

            <div>
                <div id="viewer"
                     className="epubViewer">
                    <div data-page-number={page}
                         data-loaded="true"
                         className="page"
                         style={{
                             userSelect: 'none'
                         }}/>

                    {props.children}
                </div>
            </div>

        </main>
    );
})

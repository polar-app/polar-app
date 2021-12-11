import * as React from 'react';
import {IDocAnnotationRef} from './DocAnnotation';
import Paper from "@material-ui/core/Paper";
import {AnnotationView2} from "./annotations/AnnotationView2";
import {useAnnotationSidebarStore} from '../../../apps/doc/src/AnnotationSidebarStore';
import {AnnotationActiveInputContextProvider} from "./AnnotationActiveInputContext";
import {AnnotationHeader} from './AnnotationSidebarHeader';
import isEqual from "react-fast-compare";
import {memoForwardRef} from "../react/ReactUtils";
import {FeedbackPadding} from "../../../apps/repository/js/ui/FeedbackPadding";
import {NoAnnotations} from "./NoAnnotations";

interface AnnotationSidebarItemProps {
    readonly annotation: IDocAnnotationRef;
}

const AnnotationSidebarItem = memoForwardRef((props: AnnotationSidebarItemProps) => {

    const {annotation} = props;

    return (

        <AnnotationActiveInputContextProvider>
            <>
                <>
                    <AnnotationView2 annotation={annotation}/>
                </>
            </>
        </AnnotationActiveInputContextProvider>

    );

});

const AnnotationsBlock = React.memo(function AnnotationsBlock() {

    const store = useAnnotationSidebarStore(['view']);

    if (store.view.length > 0) {
        return (
            <>
                {store.view.map(annotation => (
                    <AnnotationSidebarItem key={annotation.id}
                                           annotation={annotation}/>))}
            </>
        );

    } else {
        return <NoAnnotations/>;
    }

});

const Annotations = React.memo(function Annotations() {

    return (
        <Paper square
               elevation={0}
               className="pb-1 pt-1"
               style={{
                   flexGrow: 1,
                   display: 'flex',
                   flexDirection: 'column',
                   overflow: 'auto'
               }}>
            <FeedbackPadding>
                <AnnotationsBlock/>
            </FeedbackPadding>
        </Paper>
    );

});

export const AnnotationSidebar2 = React.memo(function AnnotationSidebar2() {

    return (

        <div id="annotation-manager"
             className="annotation-sidebar"
             style={{
                 display: "flex",
                 flexDirection: "column",
                 minHeight: 0,
                 flexGrow: 1
             }}>

            <AnnotationHeader />

            <Annotations />

        </div>

    );
}, isEqual);

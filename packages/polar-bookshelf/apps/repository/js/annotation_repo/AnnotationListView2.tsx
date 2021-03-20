import * as React from 'react';
import { AnnotationRepoTable2 } from './AnnotationRepoTable2';

/**
 * Deprecated MUI no longer needed
 */
export const AnnotationListView2 = React.memo(() => (
    <div style={{
             display: 'flex',
             flexGrow: 1,
             flexDirection: 'column',
             minHeight: 0
         }}>

        <AnnotationRepoTable2/>

    </div>
));

import * as React from 'react';
import {AnnotationRepoTable} from './AnnotationRepoTable';

/**
 * Deprecated MUI no longer needed
 */
export const AnnotationListView = React.memo(() => (
    <div style={{
             display: 'flex',
             flexGrow: 1,
             flexDirection: 'column',
             minHeight: 0
         }}>

        <AnnotationRepoTable/>

    </div>
));

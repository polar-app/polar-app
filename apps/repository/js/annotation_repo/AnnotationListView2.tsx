import * as React from 'react';
import {AnnotationRepoTable2} from './AnnotationRepoTable2';

export const AnnotationListView2 = React.memo(() => (
    <div style={{
             display: 'flex',
             flexDirection: 'column',
             minHeight: 0
         }}>

        <AnnotationRepoTable2/>

    </div>
));

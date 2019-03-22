import * as ReactDOM from 'react-dom';
import {ViewerTour} from './ViewerTour';
import * as React from 'react';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {ShareContentButton} from './ShareContentButton';
import {DocInfo} from '../../metadata/DocInfo';
import {IDocInfo} from '../../metadata/DocInfo';
import {Visibility} from '../../datastore/Datastore';
import {NULL_FUNCTION} from '../../util/Functions';

export class ShareContentButtons {

    public static create(docInfo: IDocInfo,
                         onChanged: (visiblity: Visibility) => void,
                         onDone: () => void = NULL_FUNCTION) {

        ReactInjector.inject(<ShareContentButton visibility={docInfo.visibility}
                                                 onChanged={onChanged}
                                                 onDone={onDone}/> );

    }

}

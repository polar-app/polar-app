import * as React from 'react';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {ShareContentButton} from './ShareContentButton';
import {IDocInfo} from '../../metadata/DocInfo';
import {Visibility} from '../../datastore/Datastore';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {NULL_FUNCTION} from '../../util/Functions';

export class ShareContentButtons {

    public static create(docInfo: IDocInfo,
                         datastoreCapabilities: DatastoreCapabilities,
                         onChanged: (visiblity: Visibility) => void,
                         onDone: () => void = NULL_FUNCTION) {

        const viewer = document.getElementById('mainContainer')!;
        const container = document.createElement('div');

        viewer.appendChild(container);

        ReactInjector.create(<ShareContentButton datastoreCapabilities={datastoreCapabilities}
                                                 visibility={docInfo.visibility}
                                                 onChanged={onChanged}
                                                 onDone={onDone}/>, container);

    }

}

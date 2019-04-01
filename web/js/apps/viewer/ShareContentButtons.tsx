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
                         createShareLink: () => Promise<string | undefined>,
                         onVisibilityChanged: (visiblity: Visibility) => Promise<void>,
                         onDone: () => void = NULL_FUNCTION) {

        const viewer = document.getElementById('mainContainer')!;
        const container = document.createElement('div');

        viewer.appendChild(container);

        ReactInjector.create(<ShareContentButton datastoreCapabilities={datastoreCapabilities}
                                                 createShareLink={createShareLink}
                                                 visibility={docInfo.visibility}
                                                 onVisibilityChanged={onVisibilityChanged}
                                                 onDone={onDone}/>, container);

    }

}

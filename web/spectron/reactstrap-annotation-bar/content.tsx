import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper from 'popper.js';
import $ from '../../js/ui/JQuery';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {CommentInputEvent} from '../../js/comments/react/CommentInputEvent';
import {ControlledPopups} from '../../js/ui/popup/ControlledPopups';
import {TriggerPopupEvent} from '../../js/ui/popup/TriggerPopupEvent';
import {AnnotationBar} from './AnnotationBar';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

    const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

    const child = <AnnotationBar></AnnotationBar>;
    ControlledPopups.create('my-controlled-popup', 'title', triggerPopupEventDispatcher, child);

    document.addEventListener('click', event => {

        triggerPopupEventDispatcher.dispatchEvent({
            point: {
                x: event.x,
                y: event.y
            }
        });

    });

});







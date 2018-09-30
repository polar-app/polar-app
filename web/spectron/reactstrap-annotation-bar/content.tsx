import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {ControlledPopups} from '../../js/ui/popup/ControlledPopups';
import {TriggerPopupEvent} from '../../js/ui/popup/TriggerPopupEvent';
import {AnnotationBar} from './AnnotationBar';
import {ActiveSelections} from '../../js/ui/popup/ActiveSelections';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

    const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

    const child = <AnnotationBar></AnnotationBar>;
    ControlledPopups.create('my-controlled-popup', 'top', 'title', triggerPopupEventDispatcher, child);

    document.addEventListener('click', event => {


    });

    ActiveSelections.addEventListener(event => {

        triggerPopupEventDispatcher.dispatchEvent({
            point: {
                x: event.boundingClientRect.left + (event.boundingClientRect.width / 2),
                y: event.boundingClientRect.top
            }
        });

    });

});







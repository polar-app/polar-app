// @NotStale
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {ViewerTour} from './ViewerTour';
import {LoadExampleDocs} from '../repository/onboarding/LoadExampleDocs';

export class ViewerTours {

    public static createWhenNecessary(fingerprint: string) {

        if (fingerprint === LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT) {
            this.create();
        }

    }

    public static create() {

        const id = 'viewer-tour-container';
        let container = document.getElementById(id);

        if (container) {
            return;
        }

        container = document.createElement('div');
        container.id = id;

        ReactDOM.render(

            <ViewerTour/>,

            container

        );

    }

}

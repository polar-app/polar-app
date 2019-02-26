import * as ReactDOM from 'react-dom';
import {PrioritizedSplashes} from '../../../../apps/repository/js/splash/PrioritizedSplashes';
import {SyncBar} from '../../ui/sync_bar/SyncBar';
import {RepositoryTour} from '../repository/RepositoryTour';
import {HashRouter, Route, Switch} from 'react-router-dom';
import * as React from 'react';
import {ViewerTour} from './ViewerTour';
import {LoadExampleDocs} from '../repository/onboarding/LoadExampleDocs';

export class ViewerTours {

    public static createWhenNecessary(fingerprint: string) {

        console.log("FIXME1: " + fingerprint);
        console.log("FIXME2: " + LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT);

        if (fingerprint === LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT) {
            console.log("FIXME3 loading viewer tour");
            this.create();
        }

    }

    public static create() {

        const id = 'viewer-tour-container';
        let container = document.getElementById(id);

        if (container) {
            console.log("FIXME tour already running...");
            return;
        }

        console.log("FIXME: starting tour...");

        container = document.createElement('div');
        container.id = id;

        ReactDOM.render(

            <ViewerTour/>,

            container

        );

    }

}

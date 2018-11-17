import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Version} from '../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Files} from '../../../web/js/util/Files';
import {Logger} from '../../../web/js/logger/Logger';
import {EmbeddedImages} from './EmbeddedImages';

const log = Logger.create();

export class WhatsNewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>
                <h2>1.0.14 - Nov 17, 2018</h2>

                <p className="text-center">

                    <a href="https://kevinburton1.typeform.com/to/SsuiyB">
                        <img src={EmbeddedImages.SURVEY}></img>
                    </a>

                </p>

                <p>
                    Could you take 2 minutes and <a href="https://kevinburton1.typeform.com/to/SsuiyB">answer 10 questions
                    </a> about
                    your use of Polar?  We're trying to focus on the most
                    important features for our user base and your feedback
                    is critical!
                </p>

                <h3>Project Update</h3>

                <p>
                    The 10.0.14 release focuses mostly on fit and finish.  This
                    is mostly a bug fix release but some of these were important.
                </p>

                <p>
                    The big news is all under the covers and we're about a week
                    away from having functional cloud sync.  The cloud sync
                    support will also be the basis for our online document
                    collaboration as well as mobile sync so it's going to be
                    really exciting to turn on this new functionality.
                </p>

                <h3>What's new in 10.0.14:</h3>

                <li>
                    Fixed bug where the lightbox was kept enabled after we
                    deleted an annotation
                </li>

                <li>
                    We can now capture a new class of documents that use a
                    vertical height on their CSS selectors.
                </li>

                <li>
                    We can now capture XML documents which used XSL stylesheets.
                </li>

                <li>
                    Major refactor of the disk datastore for the pending cloud
                    sync functionality we're working on.
                </li>

                <ul>

                </ul>

                <h2>1.0.12 - Nov 9, 2018</h2>

                <ul>

                    <li>
                        Feature: drag and drop for bulk PDF import works.
                    </li>

                    <li> Feature: The "Delete" text is now danger red.
                    </li>

                    <li> Feature: Implemented a confirm prompt when
                    deleteing flashcards, comments, and annotations.
                    </li>

                    <li> Feature: Implemented Cancel when creating
                    flashcards and comments </li>

                    <li> Feature: Reworked anki sync to run from the doc
                    repository. </li>

                    <li> Feature: Renamed "Copy URL" to "Copy Original
                    URL" </li>

                    <li> Fixed analytics around number of documents in
                        the repository </li>

                    <li> Upgrade to Electron 3.0.8 </li>

                    <li> Fixed bug with Electron generating an error
                    window on exit due to a conversion of the wrong type
                    to an integer.  This was/is an Electron bug. </li>

                </ul>

                <h2>1.0.10 - Nov 1, 2018</h2>

                <p>
                    A bunch of changes went into this release.  Most importantly
                    we've setup an <a href="https://opencollective.com/polar-bookshelf">
                    Open Collective project</a> to accept donations for helping support Polar
                    development.
                </p>

                <p>
                    I would personally appreciate it if you sponsored
                    Polar as it took me about two months of development
                    time and nearly $1k of my own funds to launch the
                    project.  We still have additional costs including
                    continuous integration builds, hosting costs, etc.
                </p>

                <p className="text-center">
                    <a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">
                        <img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />
                    </a>
                </p>

                <h3>Bulk Import</h3>

                <p>
                    This is probably the biggest new feature in this
                    release.  This allows you to import a large collection
                    of PDFs in a directory by selecting multiple PDFs you
                    would like to important
                    via <code>File | Import</code> and they will be
                    imported into Polar along with any
                    potential metadata (title and number of pages).
                </p>

                <p>
                    Other important features in this release include:
                </p>

                <ul>

                    <li>
                        Change capture key binding
                        to <code>CommandOrControl+N</code> (new).
                        The other key binding conflicted with window
                        management in Chrome and we might want to use those
                        key bindings in the future.
                    </li>

                    <li> Refactored the way we're handling popups for
                        the annotation bar.  I think this will resolve most
                        of the issues we're having but there are still a few
                        more glitches to be fixed. </li>

                    <li> Reworked the capture preview browser so that
                        buttons are only enabled after you first load a URL
                        so that it's not confusing for the user. </li>

                </ul>
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}

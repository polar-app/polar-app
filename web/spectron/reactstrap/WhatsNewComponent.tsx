import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Cookies from 'js-cookie';
import {Version} from '../../js/util/Version';
import {isPresent} from '../../js/Preconditions';
import {app, session} from 'electron';
import {FilePaths} from '../../js/util/FilePaths';

export class WhatsNewComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };
    }

    public render() {


        const cookieName = 'polar-whats-news-' + Version.get();
        const isOpen = ! isPresent(Cookies.get(cookieName));

        Cookies.set(cookieName, "true");

        // Cookies.set('hello', "true", {path: '/'});
        // console.log("FIXME: " + Cookies.get('hello'));
        return (

            <div>

                <Modal isOpen={isOpen}
                       size="lg"
                       style={{overflowY: 'initial'}}>
                    <ModalHeader >What's New in Polar</ModalHeader>
                    <ModalBody style={{overflowY: 'auto', maxHeight: 'calc(100vh - 200px)'}}>

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

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary">Ok</Button>{' '}
                    </ModalFooter>

                </Modal>
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}



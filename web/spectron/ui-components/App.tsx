import * as React from 'react';
import {ListOptionType} from '../../js/ui/list_selector/ListSelector';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {ViewOrEditCommentExample} from './ViewOrEditCommentExample';
import {Tag} from '../../../web/js/tags/Tag';
import {RelatedTags} from '../../js/tags/related/RelatedTags';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {ShareContentControl} from '../../js/apps/viewer/ShareContentControl';
import {Visibility} from '../../js/datastore/Datastore';
import {DatastoreCapabilities} from '../../js/datastore/Datastore';
import {NetworkLayer} from '../../js/datastore/Datastore';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {

        // ProgressBar.create();

        const options: ListOptionType[] = [
            {
                id: "title",
                label: "Title",
                selected: true
            },
            {
                id: "tags",
                label: "Tags",
                selected: false
            }
        ];

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const rects: Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}) ];
        const textSelections: TextRect[] = [new TextRect({text: "hello world"})];
        const text = "hello world";

        const textHighlight = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

        // const ref = Refs.createFromAnnotationType(textHighlight.id,
        // AnnotationType.TEXT_HIGHLIGHT);

        docMeta.pageMetas[1].textHighlights[textHighlight.id] = textHighlight.value;

        // let flashcard = Flashcards.createFrontBack(front, back, ref);
        //
        // // TODO: an idiosyncracie of the proxies system is that it mutates
        // the // object so if it's read only it won't work.  This is a bug
        // with // Proxies so I need to also fix that bug there in the future.
        // flashcard = Object.assign({}, flashcard);
        // annotation.pageMeta.flashcards[flashcard.id] = flashcard;


        // TODO: we have to create some flashcards and comments for this object
        // so that the annotation sidear renders.

        const relatedTags = new RelatedTags();

        relatedTags.update('0x01', 'set', 'linux');
        relatedTags.update('0x01', 'set', 'microsoft');

        relatedTags.update('0x02', 'set', 'linux');
        relatedTags.update('0x02', 'set', 'google');

        relatedTags.update('0x03', 'set', 'linux');
        relatedTags.update('0x03', 'set', 'microsoft');

        relatedTags.update('0x04', 'set', 'linux');
        relatedTags.update('0x04', 'set', 'microsoft');

        relatedTags.update('0x05', 'set', 'linux');
        relatedTags.update('0x05', 'set', 'google');

        const tags: Tag[] = [
            {id: 'microsoft', label: 'microsoft'},
            {id: 'google', label: 'google'}
        ];

        const existingTags: Tag[] = [
            {id: 'google', label: 'google'}
        ];

        const contextMenuHandlers = prepareContextMenuHandlers({id: 'my-context-menu'});

        const steps = [
            {
                target: '.my-first-step',
                content: 'This is my awesome feature!',
                disableBeacon: true
            },
            {
                target: '.my-other-step',
                content: 'This another awesome feature!',
            },
        ];
        // Toaster.success('A new update for Polar was downloaded.  Please
        // restart.', 'Update downloaded', { requiresAcknowledgment: true,
        // preventDuplicates: true });  Toaster.info('X A new update for Polar
        // was downloaded.  Please restart.', 'Update downloaded', {
        // requiresAcknowledgment: true, preventDuplicates: true });

        // ProgressToasters.create()
        //     .then(progressUpdater => {
        //         progressUpdater.update({title: "Finding files (5) ... ", status: '/home/burton/projects/polar-bookshelf/web/js/apps/repository/FileImportController.ts'});
        //     });

        const datastoreCapabilities: DatastoreCapabilities = {
            networkLayers: new Set<NetworkLayer>(['local'])
        };

        const createShareLink = () => {
            return 'http://example.com';
        };

        return (

            <div>

                <ShareContentControl datastoreCapabilities={datastoreCapabilities}
                                     createShareLink={createShareLink}
                                     onChanged={NULL_FUNCTION}
                                     onDone={NULL_FUNCTION}/>

                <ShareContentControl datastoreCapabilities={datastoreCapabilities}
                                     createShareLink={createShareLink}
                                     visibility={Visibility.PRIVATE}
                                     onChanged={NULL_FUNCTION}
                                     onDone={NULL_FUNCTION}/>

                <ShareContentControl datastoreCapabilities={datastoreCapabilities}
                                     createShareLink={createShareLink}
                                     visibility={Visibility.PUBLIC}
                                     onChanged={NULL_FUNCTION}
                                     onDone={NULL_FUNCTION}/>

                <ViewOrEditCommentExample/>

            </div>

        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}



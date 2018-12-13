import * as React from 'react';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {TableDropdown} from '../../../apps/repository/js/TableDropdown';
import {AnnotationSidebar} from '../../js/annotation_sidebar/AnnotationSidebar';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Refs} from '../../js/metadata/Refs';
import {Flashcards} from '../../js/metadata/Flashcards';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {AnnotationType} from '../../js/metadata/AnnotationType';
import {CommentComponent} from '../../js/annotation_sidebar/child_annotations/CommentComponent';
import {CommentComponentExample} from './CommentComponentExample';
import {FlashcardComponentExample} from './FlashcardComponentExample';
import {WhatsNewContent} from '../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import {ModalBody} from 'reactstrap';
import {CloudSyncOverviewContent} from '../../js/ui/cloud_auth/CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from '../../js/ui/cloud_auth/CloudSyncConfiguredContent';
import {CloudSyncConfiguredModal} from '../../js/ui/cloud_auth/CloudSyncConfiguredModal';
import {CloudSyncOverviewModal} from '../../js/ui/cloud_auth/CloudSyncOverviewModal';

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

        let rects: Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}) ];
        let textSelections: TextRect[] = [new TextRect({text: "hello world"})];
        let text = "hello world";

        const textHighlight = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

        //const ref = Refs.createFromAnnotationType(textHighlight.id,
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

        return (

            <div>

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                <h1>UI Components</h1>
                <hr/>

                <h1>headings</h1>

                <h1>h1</h1>
                <h2>h2</h2>
                <h3>h3</h3>
                <h4>h4</h4>
                <h5>h5</h5>

                <h1>Intro</h1>
                <hr/>

                <div className="intro">

                    <h1 className="title">This is the title</h1>

                    <h2 className="subtitle">This is the subtitle</h2>

                    <p>
                        This is just regular text.
                    </p>

                </div>

                <p>
                    List of important UI components in Polar.
                </p>

                <h2>ListSelector</h2>

                <ListSelector options={options}
                              id="list-options"
                              onChange={(value) => console.log(value)}>

                </ListSelector>

                <h2>TableDropdown</h2>

                <TableDropdown id="table-dropdown"
                               onSelectedColumns={(options) => console.log("onSelectedColumns: ", options)}
                />

                <h2>Annotation Sidebar</h2>

                <AnnotationSidebar docMeta={docMeta}/>

                <CommentComponentExample/>

                <FlashcardComponentExample/>

                <WhatsNewContent/>

                <CloudSyncOverviewContent/>

                <CloudSyncConfiguredContent/>

                {/*<CloudSyncConfiguredModal isOpen={true} onCancel={() => console.log('cancel')}/>*/}


                {/*<CloudSyncOverviewModal isOpen={true}*/}
                                        {/*onCancel={() => console.log('cancel')}*/}
                                        {/*onSignup={() => console.log('signup')}/>*/}

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



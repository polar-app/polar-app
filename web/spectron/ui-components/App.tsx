import * as React from 'react';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {DocRepoTableDropdown} from '../../../apps/repository/js/doc_repo/DocRepoTableDropdown';
import {AnnotationSidebar} from '../../js/annotation_sidebar/AnnotationSidebar';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {CommentComponentExample} from './CommentComponentExample';
import {FlashcardComponentExample} from './FlashcardComponentExample';
import {WhatsNewContent} from '../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import {Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem} from 'reactstrap';
import {CloudSyncOverviewContent} from '../../js/ui/cloud_auth/CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from '../../js/ui/cloud_auth/CloudSyncConfiguredContent';
import {InviteUsersContent} from '../../js/ui/cloud_auth/InviteUsersContent';
import {NULL_FUNCTION} from '../../js/util/Functions';
import Button from 'reactstrap/lib/Button';
import {HighlighterIcon} from '../../js/ui/standard_icons/HighlighterIcon';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {Doughnut, Line} from 'react-chartjs-2';
import {ChartData} from 'chart.js';
import {TagInput} from '../../../apps/repository/js/TagInput';
import {Tag} from '../../../web/js/tags/Tag';
import {RelatedTags} from '../../js/tags/related/RelatedTags';

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

        const data: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Documents Added',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };

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

        return (

            <div>

                <br/><br/><br/>

                &nbsp;&nbsp;&nbsp;

                <TagInput availableTags={tags}
                          existingTags={existingTags}
                          relatedTags={relatedTags}
                          onChange={newTags => console.log('got tags', newTags)}/>

                <Line data={data} height={100} />

                <div className="p-2">
                    <ToggleButton label="flagged only"
                                  onChange={() => console.log('changed')}/>
                </div>


                <div className="p-2">

                    <Button color="light p-0 pr-1 border rounded" size="sm">

                        <div style={{display: 'flex'}}>

                            <div className="p-1 bg-secondary text-light rounded-left"
                                 style={{verticalAlign: 'middle', textAlign: 'center', width: '2.5em'}}>

                                &nbsp;<i className="fas fa-minus"></i>&nbsp;

                            </div>

                            <div className="p-1"
                                 style={{verticalAlign: 'middle'}}>
                                &nbsp;flagged only
                            </div>

                        </div>

                    </Button>

                </div>



                <div className="p-2">


                    <Button color="light p-0 pr-1 border rounded" size="sm">

                        <div style={{display: 'flex'}}>

                            <div className="p-1 bg-primary text-light rounded-left"
                                 style={{verticalAlign: 'middle', textAlign: 'center', width: '2.5em'}}>

                                &nbsp;<i className="fas fa-check"></i>&nbsp;

                            </div>

                            <div className="p-1"
                                 style={{verticalAlign: 'middle'}}>
                                &nbsp;flagged only
                            </div>

                        </div>

                    </Button>

                </div>


                <div className="p-2">

                    <Button color="light" size="sm">
                        <i className="fas fa-check"></i> &nbsp;flagged only
                    </Button>

                </div>

                <div className="form-group">
                    <input type="checkbox" name="fancy-checkbox-default"
                           id="fancy-checkbox-default" autoComplete="off"/>
                    <div className="btn-group">
                        <label htmlFor="fancy-checkbox-default"
                               className="btn btn-default">
                            <span className="glyphicon glyphicon-ok"></span>
                            <span> </span>
                        </label>
                        <label htmlFor="fancy-checkbox-default"
                               className="btn btn-default active">
                            Default Checkbox
                        </label>
                    </div>
                </div>

                <div style={{backgroundColor: 'black', padding: '20px'}}>

                    <HighlighterIcon color={'yellow'}/>
                </div>

                <HighlighterIcon color={'yellow'}/>


                <section className="sidebar text-muted p-1">

                    <ListGroup flush>
                        <ListGroupItem active={true} tag="a" href="#" action>
                            <i className="fas fa-archive"></i>
                            &nbsp; Documents
                        </ListGroupItem>

                        <ListGroupItem tag="a" href="#" action>
                            <i className="fas fa-sticky-note"></i>
                            &nbsp; Annotations
                        </ListGroupItem>

                        <ListGroupItem tag="a" href="#" action>
                            <i className="fas fa-sticky-note"></i>
                            &nbsp; Settings
                        </ListGroupItem>

                    </ListGroup>

                </section>




                <div className="p-2">

                    <InputGroup className="border rounded">

                        <Button color="primary">
                            <i className="fas fa-check"></i> &nbsp;
                        </Button>
                        <InputGroupAddon addonType="append">
                            <Button color="light">flagged only</Button>
                        </InputGroupAddon>
                    </InputGroup>

                </div>

                <div className="p-2">

                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <Button>To the Left!</Button>
                        </InputGroupAddon>
                        <Input type="checkbox" />
                    </InputGroup>

                </div>


                {/*<InviteUsersContent onInvitedUserText={NULL_FUNCTION}/>*/}

                {/*<InviteUsersModal isOpen={true} onCancel={NULL_FUNCTION} onInvite={(emailAddresses) => console.log(emailAddresses)}/>*/}

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

                <DocRepoTableDropdown id="table-dropdown"
                                      onSelectedColumns={(newOptions) => console.log("onSelectedColumns: ", newOptions)}
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



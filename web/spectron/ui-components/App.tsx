import * as React from 'react';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {DocRepoTableDropdown} from '../../../apps/repository/js/doc_repo/DocRepoTableDropdown';
import {AnnotationSidebar} from '../../js/annotation_sidebar/AnnotationSidebar';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {ViewOrEditCommentExample} from './ViewOrEditCommentExample';
import {FlashcardComponentExample} from './FlashcardComponentExample';
import {WhatsNewContent} from '../../../apps/repository/js/splash2/whats_new/WhatsNewContent';
import {CloudSyncOverviewContent} from '../../js/ui/cloud_auth/CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from '../../js/ui/cloud_auth/CloudSyncConfiguredContent';
import {HighlighterIcon} from '../../js/ui/standard_icons/HighlighterIcon';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {TagInput} from '../../../apps/repository/js/TagInput';
import {Tag} from '../../../web/js/tags/Tag';
import {RelatedTags} from '../../js/tags/related/RelatedTags';
import {CommentIcon} from '../../js/ui/standard_icons/CommentIcon';
import {FlashcardIcon} from '../../js/ui/standard_icons/FlashcardIcon';
import {FlashcardInput} from '../../js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInput';
import {FlashcardInputForCloze} from '../../js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from '../../js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInputForFrontAndBack';
import {EditComment} from '../../js/annotation_sidebar/child_annotations/comments/EditComment';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {ExportButton} from '../../js/ui/export/ExportButton';
import {EditorsPicksContent} from '../../../apps/repository/js/editors_picks/EditorsPicksContent';
import {AnkiReviewContent} from './AnkiReviewContent';
import ReadingProgressTable from '../../../apps/repository/js/stats/ReadingProgressTable';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {TestMenu} from './TestMenu';
import {Feedback} from '../../js/ui/feedback/Feedback';
import Button from 'reactstrap/lib/Button';
import {ProgressToasters} from '../../js/ui/progress_toaster/ProgressToasters';
import {AccountControlBar} from '../../../web/js/ui/cloud_auth/AccountControlBar';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {AccountControlDropdown} from '../../../web/js/ui/cloud_auth/AccountControlDropdown';
import {RichTextFeatureIntro} from '../../../web/js/annotation_sidebar/RichTextFeatureIntro';
import {SimpleTooltip} from '../../js/ui/tooltip/SimpleTooltip';
import {SimpleTooltipEx} from '../../js/ui/tooltip/SimpleTooltipEx';
import {ContextMenu} from '../../js/ui/context_menu/ContextMenu';
import {MenuItem} from '@burtonator/react-dropdown';
import {ContextMenuMessages} from '../../js/contextmenu/ContextMenuMessages';
import {DocContextMenu} from './DocContextMenu';
import {Dialogs} from '../../js/ui/dialogs/Dialogs';
import {DocContextMenu2} from './DocContextMenu2';
import Dropdown from 'reactstrap/lib/Dropdown';
import {LeftRightSplit} from '../../js/ui/left_right_split/LeftRightSplit';
import {URLs} from '../../js/util/URLs';
import {Blobs} from '../../js/util/Blobs';
import {Dock} from '../../js/ui/dock/Dock';
import {Channels} from '../../js/util/Channels';
import {Suggestions} from '../../js/ui/feedback/Suggestions';
import {FakeComponent0} from './FakeComponent0';
import {Canvases} from '../../js/util/Canvases';
import {ColorDropdown} from './ColorDropdown';
import {ColorSelector} from '../../js/ui/colors/ColorSelector';
import {TreeNode} from '../../js/ui/tree/TreeNode';
import {TreeView} from '../../js/ui/tree/TreeView';
import {TagNodes} from '../../js/tags/TagNode';
import {Tags} from '../../js/tags/Tags';
import {TagTree} from '../../js/ui/tree/TagTree';
import {NPSModal} from '../../../apps/repository/js/splash2/nps/NPSModal';
import {SuggestionsModal} from '../../../apps/repository/js/splash2/suggestions/SuggestionsModal';
import {Premium} from '../../../apps/repository/js/splash/splashes/premium/Premium';
import {Nav} from '../../js/ui/util/Nav';
import {SubscriptionPlan} from './SubscriptionPlan';
import {CrowdfundingBar} from '../../js/ui/crowdfunding/CrowdfundingBar';
import {ShareContentControl} from '../../js/apps/viewer/ShareContentControl';
import {NetworkLayers} from '../../js/datastore/Datastore';

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        //
        // const root: TNode<TagNode> = {
        //     id: 0,
        //     name: 'CompSci',
        //     children: [
        //         {
        //             id: 1,
        //             name: 'Linux',
        //             children: [],
        //             value: {
        //                 tag: "/CompSci/Linux"
        //             }
        //         },
        //         {
        //             id: 2,
        //             name: 'Google',
        //             children: [
        //                 {
        //                     id: 3,
        //                     name: 'Mountain View',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/Mountain View"
        //                     }
        //                 },
        //                 {
        //                     id: 4,
        //                     name: 'San Francisco',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/San Francisco"
        //                     }
        //                 },
        //             ],
        //             value: {
        //                 tag: "/CompSci/Google"
        //             }
        //
        //         }
        //
        //     ],
        //     value: {
        //         tag: "/CompSci"
        //     }
        // };

        const tags = [
            '/CompSci/Google',
            '/CompSci/Linux',
            '/CompSci/Microsoft',
            '/CompSci/Programming Languages/C++',
            '/CompSci/Programming Languages/Java',
            '/History/WWII',
            '/History/United States/WWII',
        ].map(current => Tags.create(current))
            .map(current => {
                const count = Math.floor(Math.random() * 100);
                return {...current, count};
            });

        // const root: TNode<Tag> = TagNodes.create(...tags);

        return (

            <div style={{margin: '5px'}}>

                <ShareContentControl datastoreCapabilities={{
                                        networkLayers: NetworkLayers.LOCAL_AND_WEB,
                                        permission: {
                                            mode: 'rw'}
                                        }
                                     }
                                     createShareLink={async () => 'http://example.com?1=2'}
                                     onVisibilityChanged={async () => console.log('visibility changed')}
                                     onDone={NULL_FUNCTION}/>

                {/*<CrowdfundingBar/>*/}


                {/*<Button className="ml-2"*/}
                {/*        color="light"*/}
                {/*        size="sm"*/}
                {/*        onClick={NULL_FUNCTION}*/}
                {/*        style={{*/}
                {/*            backgroundColor: 'red',*/}
                {/*            fontWeight: 'bold'*/}
                {/*        }}>Go Premium</Button>*/}

                {/*<div>*/}

                {/*    <div style={{display: 'flex'}}>*/}

                {/*        <div className="mt-auto mb-auto">*/}
                {/*            You're currently on the <b>BRONZE</b> plan.*/}
                {/*        </div>*/}

                {/*        <div className="ml-auto mt-auto mb-auto">*/}

                {/*            <Button color="primary"*/}
                {/*                    size="sm"*/}
                {/*                    onClick={() => Nav.openLinkWithNewTab('https://getpolarized.io/pricing.html')}>*/}

                {/*                <i className="fas fa-external-link-alt"></i>*/}
                {/*                &nbsp;*/}
                {/*                View Plans and Pricing*/}

                {/*            </Button>*/}

                {/*        </div>*/}

                {/*    </div>*/}

                {/*    <div style={{display: 'flex'}} className="mt-1">*/}

                {/*        <Button color="danger" size="md">*/}
                {/*            <span>Cancel Subscription</span>*/}
                {/*        </Button>*/}

                {/*        <div className="ml-auto">*/}

                {/*            <UncontrolledDropdown>*/}

                {/*                <DropdownToggle color="secondary" caret>*/}
                {/*                    Change Plan*/}
                {/*                </DropdownToggle>*/}

                {/*                <DropdownMenu>*/}
                {/*                    <DropdownItem>BRONZE</DropdownItem>*/}
                {/*                    <DropdownItem>SILVER</DropdownItem>*/}
                {/*                    <DropdownItem>GOLD</DropdownItem>*/}
                {/*                </DropdownMenu>*/}

                {/*            </UncontrolledDropdown>*/}

                {/*        </div>*/}

                {/*    </div>*/}

                {/*    <p>*/}
                {/*        If you have any issues with billing or questions about*/}
                {/*        your plan please contact <b>support@getpolarized.io</b>.*/}
                {/*    </p>*/}

                {/*</div>*/}


                {/*<hr/>*/}

                {/*<div style={{display: 'flex'}}>*/}


                {/*    <SubscriptionPlan name="Free" capacity="350" unit="MB" price="0.00"/>*/}
                {/*    <SubscriptionPlan name="Bronze" capacity="2" unit="GB" price="4.99" selected/>*/}
                {/*    <SubscriptionPlan name="Silver" capacity="50" unit="GB" price="9.99"/>*/}
                {/*    <SubscriptionPlan name="Gold" capacity="1000" unit="GB" price="14.99"/>*/}

                {/*</div>*/}


                {/*<div style={{display: 'flex'}} className="mt-1">*/}

                {/*    <Button color="danger"*/}
                {/*            size="sm">*/}
                {/*        <span>Cancel Subscription</span>*/}
                {/*    </Button>*/}

                {/*    <div className="ml-auto">*/}

                {/*        <Button color="primary"*/}
                {/*                size="sm"*/}
                {/*                onClick={() => Nav.openLinkWithNewTab('https://getpolarized.io/pricing.html')}>*/}

                {/*            <i className="fas fa-external-link-alt"></i>*/}
                {/*            &nbsp;*/}
                {/*            View Plans and Pricing*/}

                {/*        </Button>*/}


                {/*    </div>*/}

                {/*</div>*/}


            </div>

        );
    }


}

export default App;

interface IAppState {

}



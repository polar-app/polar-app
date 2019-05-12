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
import {TNode} from './TreeNode';
import {TreeNode} from './TreeNode';

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Left = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
        this is some content that is very very very long.
    </div>;
}

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        const root: TNode = {
            name: 'CompSci',
            children: [
                {
                    name: 'Linux'
                },
                {
                    name: 'Google',
                    children: [
                        {
                            name: 'Mountain View'
                        },
                        {
                            name: 'San Francisco'
                        },
                    ]

                }

            ]
        };

        return (

            <div style={{marginLeft: '5px'}}>

                <TreeNode node={root}/>

                {/*<Dock side="left"*/}
                {/*      style={{height: '100vh'}}*/}
                {/*      left={<Left/>}*/}
                {/*      right={<div style={{backgroundColor: 'blue'}}>this is the right</div>}/>*/}

            </div>

        );
    }


}

export default App;

interface IAppState {

}



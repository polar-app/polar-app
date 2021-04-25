import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons/faCheckSquare";
import {faCoffee} from "@fortawesome/free-solid-svg-icons/faCoffee";
import {faTag} from "@fortawesome/free-solid-svg-icons/faTag";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import {faSquare} from "@fortawesome/free-regular-svg-icons/faSquare";
import {faChrome} from "@fortawesome/free-brands-svg-icons/faChrome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";
import {faDatabase} from "@fortawesome/free-solid-svg-icons/faDatabase";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {faFile} from "@fortawesome/free-solid-svg-icons/faFile";
import {faStickyNote} from "@fortawesome/free-solid-svg-icons/faStickyNote";
import {faFilePdf} from "@fortawesome/free-solid-svg-icons/faFilePdf";
import {faBold} from "@fortawesome/free-solid-svg-icons/faBold";
import {faItalic} from "@fortawesome/free-solid-svg-icons/faItalic";
import {faQuoteLeft} from "@fortawesome/free-solid-svg-icons/faQuoteLeft";
import {faUnderline} from "@fortawesome/free-solid-svg-icons/faUnderline";
import {faStrikethrough} from "@fortawesome/free-solid-svg-icons/faStrikethrough";
import {faSubscript} from "@fortawesome/free-solid-svg-icons/faSubscript";
import {faSuperscript} from "@fortawesome/free-solid-svg-icons/faSuperscript";
import {faLink} from "@fortawesome/free-solid-svg-icons/faLink";

import {IconProp, library} from "@fortawesome/fontawesome-svg-core";
import {deepMemo} from "../react/ReactUtils";

library.add(faCheckSquare, faCoffee, faTag, faPlus, faCheckSquare, faDatabase, faTimesCircle, faSquare, faChrome, faGoogle, faDiscord, faStickyNote, faFilePdf);

// to minimize size we have to:
// https://github.com/FortAwesome/react-fontawesome/issues/70

interface FASvgIconProps extends SvgIconProps {
    readonly icon: IconProp;
}

const FASvgIcon = deepMemo(function FASvgIcon(props: FASvgIconProps) {
    return (
        <SvgIcon {...props}>
            <FontAwesomeIcon icon={props.icon} />
        </SvgIcon>
    );
});

function createIcon(icon: IconProp) {
    return deepMemo((props: SvgIconProps) => (
        <FASvgIcon icon={icon} {...props}/>
    ))
}

export const FACheckSquareIcon = createIcon(faCheckSquare);
export const FASquareIcon = createIcon(faSquare);
export const FAGoogleIcon = createIcon(faGoogle);
export const FAChromeIcon = createIcon(faChrome);
export const FADiscordIcon = createIcon(faDiscord);
export const FATagIcon = createIcon(faTag);
export const FAPlusIcon = createIcon(faPlus);
export const FACheckCircleIcon = createIcon(faCheckCircle);
export const FATimesCircleIcon = createIcon(faTimesCircle);
export const FADatabaseIcon = createIcon(faDatabase);
export const FAHomeIcon = createIcon(faHome);
export const FAFileIcon = createIcon(faFile);
export const FAStickyNoteIcon = createIcon(faStickyNote);
export const FaFilePdfIcon = createIcon(faFilePdf);
export const FABoldIcon = createIcon(faBold);
export const FAItalicIcon = createIcon(faItalic);
export const FAQuoteLeftIcon = createIcon(faQuoteLeft);
export const FAUnderlineIcon = createIcon(faUnderline);
export const FAStrikethroughIcon = createIcon(faStrikethrough);
export const FASubscriptIcon = createIcon(faSubscript);
export const FASuperscriptIcon = createIcon(faSuperscript);
export const FALinkIcon = createIcon(faLink);

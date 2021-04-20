import * as React from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ScaleLevel, ScaleLevelTuples} from "../ScaleLevels";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {DocFindButton} from "../DocFindButton";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import Divider from "@material-ui/core/Divider";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {useDocFindStore} from "../DocFindStore";
import {DocumentWriteStatus} from "../../../../web/js/apps/repository/connectivity/DocumentWriteStatus";
import {MUIDocFlagButton} from "../../../repository/js/doc_repo/buttons/MUIDocFlagButton";
import {MUIDocArchiveButton} from "../../../repository/js/doc_repo/buttons/MUIDocArchiveButton";
import {DocViewerToolbarOverflowButton} from "../DocViewerToolbarOverflowButton";
import {MUIDocTagButton} from "../../../repository/js/doc_repo/buttons/MUIDocTagButton";
import {FullScreenButton} from "./FullScreenButton";
import {NumPages} from "./NumPages";
import {PageNumberInput} from "./PageNumberInput";
import {PagePrevButton} from "./PagePrevButton";
import {PageNextButton} from "./PageNextButton";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {DockLayoutToggleButton} from "../../../../web/js/ui/doc_layout/DockLayoutToggleButton";
import {ZenModeActiveContainer} from "../../../../web/js/mui/ZenModeActiveContainer";
import {ZenModeButton} from "./ZenModeButton";

const getScaleLevelTuple = (scale: ScaleLevel) => (
    arrayStream(ScaleLevelTuples)
        .filter(current => current.value === scale)
        .first()
);

export const DocViewerToolbar = deepMemo(function DocViewerToolbar() {

    const {docScale, pageNavigator, scaleLeveler, docMeta}
        = useDocViewerStore(['docScale', 'pageNavigator', 'scaleLeveler', 'docMeta']);
    const {finder} = useDocFindStore(['finder']);
    const {setScale, onDocTagged, doZoom, toggleDocArchived, toggleDocFlagged} = useDocViewerCallbacks();

    const handleScaleChange = React.useCallback((scale: ScaleLevel) => {

        setScale(getScaleLevelTuple(scale)!);

    }, [setScale]);

    const zoomValue = React.useMemo(() => {
        if (!docScale || !docScale.scale.value) {
            return 'page-width';
        }
        if (getScaleLevelTuple(docScale.scale.value)) {
            return docScale.scale.value;
        }
        return 'custom';
    }, [docScale]);

    return (
        <ZenModeActiveContainer>
            <MUIPaperToolbar borderBottom>

                <div style={{
                         display: 'flex',
                     }}
                     className="p-1 vertical-aligned-children">

                    <div style={{
                            display: 'flex',
                            flexGrow: 1,
                            flexBasis: 0
                         }}
                         className="vertical-aligned-children">

                        <MUIButtonBar>

                            <DockLayoutToggleButton side='left' size="small"/>

                            {finder && (
                                <>
                                    <DocFindButton className="mr-1"/>
                                    <Divider orientation="vertical" flexItem={true}/>
                                </>
                            )}

                            <PagePrevButton/>

                            <PageNextButton/>

                            {pageNavigator && (
                                <>
                                    <PageNumberInput nrPages={pageNavigator.count}/>
                                    <NumPages nrPages={pageNavigator.count}/>
                                </>
                            )}

                        </MUIButtonBar>
                    </div>

                    <div style={{
                             display: 'flex',
                             flexGrow: 1,
                             flexBasis: 0
                         }}
                         className="vertical-align-children">

                        <div style={{
                                 display: 'flex',
                                 alignItems: 'center'
                             }}
                             className="ml-auto mr-auto vertical-align-children">

                             {docScale && scaleLeveler && (
                                <DeviceRouters.Desktop>
                                    <MUIButtonBar>
                                        <IconButton size="small" onClick={() => doZoom('-')}>
                                            <RemoveIcon/>
                                        </IconButton>

                                            <FormControl variant="outlined" size="small">
                                                <Select value={zoomValue}
                                                        onChange={event => handleScaleChange(event.target.value as ScaleLevel)}>
                                                    {zoomValue === "custom" &&
                                                        <MenuItem disabled value="custom">
                                                            {(+docScale.scale.value * 100).toFixed(2)}%
                                                            &nbsp;(Custom)
                                                        </MenuItem>
                                                    }
                                                    {ScaleLevelTuples.map(current => (
                                                        <MenuItem key={current.value}
                                                                  value={current.value}>
                                                            {current.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                        <IconButton size="small"  onClick={() => doZoom('+')}>
                                            <AddIcon/>
                                        </IconButton>

                                    </MUIButtonBar>
                                </DeviceRouters.Desktop>
                            )}

                        </div>

                    </div>

                    <div style={{
                             display: 'flex',
                             flexGrow: 1,
                             flexBasis: 0
                         }}
                         className="vertical-aligned-children">

                        <div style={{display: 'flex'}}
                             className="ml-auto vertical-aligned-children">

                            <MUIButtonBar>


                                {/* TODO: implement keyboard shortcuts for these. */}
                                <MUIDocTagButton size="small"
                                                 onClick={onDocTagged}/>

                                <MUIDocArchiveButton size="small"
                                                     onClick={toggleDocArchived}
                                                     active={docMeta?.docInfo?.archived}/>

                                <MUIDocFlagButton size="small"
                                                  onClick={toggleDocFlagged}
                                                  active={docMeta?.docInfo?.flagged}/>

                                <Divider orientation="vertical" flexItem={true}/>

                                {/*
                                <div className="ml-3 mr-2" style={{display: 'flex'}}>
                                    <DocumentWriteStatus/>
                                </div>
                                */}

                                <ZenModeButton/>

                                <FullScreenButton/>

                                <DocViewerToolbarOverflowButton docInfo={docMeta?.docInfo}/>

                                <DockLayoutToggleButton side='right' size="small"/>

                            </MUIButtonBar>
                        </div>

                    </div>

                </div>
            </MUIPaperToolbar>
        </ZenModeActiveContainer>
    );
});


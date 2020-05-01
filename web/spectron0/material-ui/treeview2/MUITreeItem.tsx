import TreeItem, {TreeItemProps} from "@material-ui/lab/TreeItem";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";

interface IProps extends TreeItemProps {
    readonly info?: string | number;
    // readonly selected: boolean;
    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
}

// export const MUITreeItem = React.memo((props: IProps) => (
//     <TreeItem style={{userSelect: 'none'}}
//               nodeId={props.nodeId}
//               children={props.children}
//               collapseIcon={<MinusSquare onClick={() => props.onNodeCollapse(props.nodeId)}/>}
//               expandIcon={<PlusSquare onClick={() => props.onNodeExpand(props.nodeId)}/>}
//               label={
//                   <div style={{
//                       display: 'flex',
//                       alignItems: 'center'
//                   }}>
//
//                       <Box pt={1}
//                            pb={1}
//                            onClick={() => props.onNodeSelectToggle(props.nodeId, 'checkbox')}>
//                           <Checkbox checked={props.selected}
//                                     style={{padding: 0}}
//
//                           />
//                       </Box>
//
//                       <div style={{flexGrow: 1}}>
//                           <Box pl={1} pt={1} pb={1}
//                                onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
//                               {props.label}
//                           </Box>
//                       </div>
//
//                       <Box pt={1} pb={1}  onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
//
//                           <Typography variant="caption" color="textSecondary">
//                               {props.info}
//                           </Typography>
//                       </Box>
//
//                   </div>
//               }/>
// ), isEqual);

export const MUITreeItem = (props: IProps) => {

    console.log("FIXME: rendering: " + props.label);

    function handleExpand() {
        console.log("FIXME: onExpand")
        props.onNodeExpand(props.nodeId);
    }

    return (

        <TreeItem label={(
                <div onClick={handleExpand}>{props.label}</div>
            )}
            nodeId={props.nodeId}/>
    );
};



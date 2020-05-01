import TreeItem, {TreeItemProps} from "@material-ui/lab/TreeItem";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import TreeView from "@material-ui/lab/TreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TNode} from "../../../js/ui/tree/TreeView";
import {MinusSquare} from "./MUITreeIcons";
import {PlusSquare} from "../treeview/MUITreeIcons";
import isEqual from "react-fast-compare";


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
// // ), isEqual);
//
// export const MUITreeItem = (props: IProps) => {
//
//     console.log("FIXME: rendering: " + props.label);
//
//     function handleExpand() {
//         console.log("FIXME: onExpand")
//         props.onNodeExpand(props.nodeId);
//     }
//
//     return (
//
//         <TreeItem label={(
//                 <div onClick={handleExpand}>{props.label}</div>
//             )}
//             nodeId={props.nodeId}/>
//     );
// };

interface MUITreeChildrenProps {

    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
    readonly childNodes: ReadonlyArray<TNode<TagDescriptor>>;

    // readonly children?: any;

}


export const MUITreeChildren = (props: MUITreeChildrenProps) => {

    return props.childNodes.map((child) => {
         return (
                <MUITreeItem key={child.id}
                             nodeId={child.id}
                             label={child.name}
                             childNodes={child.children}
                             onNodeExpand={props.onNodeExpand}
                             onNodeCollapse={props.onNodeCollapse}
                             onNodeSelectToggle={props.onNodeSelectToggle}
                             />
            );
        }
    );

}


interface CollapseIconProps {
    readonly nodeId: string;
    readonly onNodeCollapse: (node: string) => void;
}

export const CollapseIcon = React.memo((props: CollapseIconProps) => {
    return (
        <MinusSquare onClick={() => props.onNodeCollapse(props.nodeId)}/>
    );
}, isEqual);

interface ExpandIconProps {
    readonly nodeId: string;
    readonly onNodeExpand: (node: string) => void;
}

export const ExpandIcon = React.memo((props: ExpandIconProps) => {
    return (
        <PlusSquare onClick={() => props.onNodeExpand(props.nodeId)}/>
    );
}, isEqual);

interface IProps {

    readonly nodeId: string;
    readonly label: string;
    readonly info?: string | number;

    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
    readonly childNodes: ReadonlyArray<TNode<TagDescriptor>>;

}

export const MUITreeItem = React.memo((props: IProps) => {
    return (
        <TreeItem nodeId={props.nodeId}
                  label={props.label}
                  collapseIcon={<CollapseIcon nodeId={props.nodeId} onNodeCollapse={props.onNodeCollapse} />}
                  expandIcon={<ExpandIcon nodeId={props.nodeId} onNodeExpand={props.onNodeExpand}/>}
                  TransitionProps={{timeout: 50}}>

            {props.childNodes.map((child) => {
                 return (
                        <MUITreeItem key={child.id}
                                     nodeId={child.id}
                                     label={child.name}
                                     childNodes={child.children}
                                     onNodeExpand={props.onNodeExpand}
                                     onNodeCollapse={props.onNodeCollapse}
                                     onNodeSelectToggle={props.onNodeSelectToggle}
                                     />
                    );
                }
            )}
        </TreeItem>
    )
}, isEqual);

//
// //
// // const onNodeSelectToggle = (node: NodeID, type: NodeSelectToggleType) => {
// //
// //     const isSelected = selected.includes(node);
// //
// //     const toggleCheckbox = () => {
// //
// //         if (isSelected) {
// //             const newSelected = selected.filter(current => node !== current)
// //             setSelected(newSelected);
// //         } else {
// //             const newSelected = [...selected, node];
// //             setSelected(newSelected);
// //         }
// //
// //     };
// //
// //     const toggleClick = () => {
// //
// //         if (isSelected && selected.length === 1) {
// //             setSelected([]);
// //         } else {
// //             const newSelected = [node];
// //             setSelected(newSelected);
// //         }
// //
// //     };
// //
// //     switch (type) {
// //         case "click":
// //             toggleClick();
// //             break;
// //         case "checkbox":
// //             toggleCheckbox();
// //             break;
// //     }
// //
// // };
//
//
//
//             {/*<MUITreeItem {...itemProps}*/}
//             {/*             nodeId={root.id}*/}
//             {/*             label={`${root.name} (${root.id})`}*/}
//             {/*             info={root.count}>*/}
//
//             <TreeItem nodeId={root.id}
//                       label={`${root.name} (${root.id})`}
//                       // info={root.count}
//                       // TransitionComponent={<Collapse timeout={50}/>}
//                       TransitionProps={{timeout: 50}}
//                       >
//
//             {root.children.map((child) => {
//
//                     // console.log("FIXME adding child");
//                     return (
//
//                         <TreeItem key={child.id}
//                                   nodeId={child.id}
//                                   label={`${child.name} (${child.id})`}
//                                   />
//                     );
//                 })}
//             </TreeItem>


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

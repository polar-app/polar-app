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

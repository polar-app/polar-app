import {TransitionProps} from "@material-ui/core/transitions";
import {animated, useSpring} from "react-spring/web.cjs";
import Collapse from "@material-ui/core/Collapse";
import TreeItem, {TreeItemProps} from "@material-ui/lab/TreeItem";
import {createStyles, fade, Theme, withStyles} from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {MinusSquare, PlusSquare} from "./MUITreeIcons";
import {NodeSelectToggleType} from "./MUITreeView";
import Box from "@material-ui/core/Box";

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        // from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        // to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props}
                      // onClick={event => event.stopPropagation()}
                      />
        </animated.div>
    );
}

// FIXME: memoize this...

interface StyledTreeItemProps extends TreeItemProps {
    readonly info?: string | number;
    readonly selected: boolean;
    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
}

const WithStyles = withStyles((theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 5,
            paddingLeft: 15,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
    }),
);

export const MUITreeItem = WithStyles((props: StyledTreeItemProps) => (
    <TreeItem style={{userSelect: 'none'}}
              nodeId={props.nodeId}
              children={props.children}
              collapseIcon={<MinusSquare onClick={() => props.onNodeCollapse(props.nodeId)}/>}
              expandIcon={<PlusSquare onClick={() => props.onNodeExpand(props.nodeId)}/>}
              label={
                  <div style={{
                           display: 'flex',
                           alignItems: 'center'
                       }}>

                      <Box pt={1}
                           pb={1}
                           onClick={() => props.onNodeSelectToggle(props.nodeId, 'checkbox')}>
                          <Checkbox checked={props.selected}
                                    style={{padding: 0}}

                                    />
                      </Box>

                      <div style={{flexGrow: 1}}>
                          <Box pl={1} pt={1} pb={1}
                               onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
                            {props.label}
                          </Box>
                      </div>

                      <Box pt={1} pb={1}  onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>

                          <Typography variant="caption" color="textSecondary">
                              {props.info}
                          </Typography>
                      </Box>

                  </div>
              }
             // label={props.label}
              TransitionComponent={TransitionComponent} />
    )
);

import React from "react";
import { Tab, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom"
import CloseIcon from '@material-ui/icons/Close';
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";

const TAB_CLOSE_TIME = 200;

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  tab: {
    position: "relative",
    padding: 0,
    textTransform: "none",
    minHeight: "3em",
    maxHeight: "3em",
    maxWidth: "0px",
    transition: `max-width ${TAB_CLOSE_TIME}ms`,
    flex: "1 1 0",
    justifyContent: "flex-start",
    alignItems: "center",
    minWidth: 0,
    // we must overflow to allow the wrapper to have overflow hidden
    // so we get text elipsis
    /*
    overflow: "auto",
    overflowX: "auto",
    overflowY: "auto",
    */

    // Dividers for all tabs except the first
    "& + &": {
      borderLeft: "1px solid " + theme.palette.divider,
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px"
    },

    // Set color and rounded for hover
    "&:hover": {
      backgroundColor: theme.palette.background.default,
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px"
    },

    // Set color for selected
    "&$selected, &$selected:hover": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderLeft: "1px solid transparent",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px"
    },
    // Disable border for tab after selected, and hover
    "&$selected + &, &:hover + &, &:hover": {
      borderLeft: "1px solid transparent"
    }
  },
  tabOpened: {
    maxWidth: "160px"
  },
  tabClosed: {
    maxWidth: "0px"
  },
  wrapper: {
    marginTop: "5px",
    marginBottom: "5px",
    paddingLeft: "10px",

    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "left",

    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  selected: {},
  tabLabelContainer: {
    width: "100%"
  },
  gradient: {
    WebkitMaskImage:
      "linear-gradient(90deg, #000 0%, #000 calc(100% - 36px), transparent calc(100% - 24px))"
  },
  closeButton: {
    position: "absolute",
    right: "10px",
    top: "8px"
  },
  closeButtonHighlight: {
    opacity: 0,
    "&:hover": {
      opacity: 1
    }
  }
}));

interface ChromeTabLabelProps {
  readonly label: string;

  // If onClose === undefined, then close button is hidden
  readonly onClose?: (event: React.SyntheticEvent) => void;
}

// Contents of BrowserTab
const ChromeTabLabel = (props: ChromeTabLabelProps) => {
  const classes = useStyles();
  const iconHeight = 8;
  const circleRadius = 8;

  return (
    <div className={classes.tabLabelContainer}>
      <div className={`${classes.tabLabelContainer} ${classes.gradient}`}>
        <span>{props.label}</span>
      </div>

      {props.onClose !== undefined && (
        <div className={classes.closeButton} onClick={props.onClose}>
          <CloseIcon />
        </div>
      )}
    </div>
  );
};

interface ChromeTabProps {
  readonly label: string;
  readonly positionIndex: number;
  readonly currentValue: number;
  readonly onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  readonly url: string;

  // onClose is called when the button is clicked, then the callback is called
  // when the animation finishes. If onChange === undefined, then closing is
  // disabled.
  readonly onClose?: () => Function;

  // If onDrag === undefined, then dragging is disabled
  readonly tabIndex: number;
  readonly onDrag?: (x: number, index: number) => boolean;
  readonly onUpdateX: (x: number, index: number) => void;
  readonly shouldUpdateX: boolean;
}

export const ChromeTab = (props: ChromeTabProps) => {
  const [startX, setStartX] = React.useState(-1);
  const [holdX, setHoldX] = React.useState(undefined as number | undefined);
  const [close, setClose] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState(true);

  const tabRef = React.useRef() as React.RefObject<HTMLButtonElement>;
  const currentTab = tabRef.current!;

  const classes = useStyles();

  const draggable = props.onDrag !== undefined;

  const updateX = () => {
    props.onUpdateX(
      tabRef.current!.getBoundingClientRect().x,
      props.positionIndex
    );
  };

  // Can only be called if props.onClose !== undefined
  const handleClose = () => {
    const finishClose = props.onClose!();
    setClose(true);
    setTimeout(() => {
      finishClose();
    }, TAB_CLOSE_TIME);
  };

  // Open onMouseDown instead of the default onMouseUp
  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      props.onChange(event, props.positionIndex);
    } else if (event.button === 1 && props.onClose !== undefined) {
      handleClose();
    }
  };

  // On render/update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!open) {
      // setInitial(false);
      setOpen(true);
      /*
      setTimeout(() => {
      }, TAB_CLOSE_TIME);
      */
    }

    // Restore x position if holdX !== undefined
    if (holdX !== undefined) {
      const currentX = currentTab.getBoundingClientRect().x;
      setStartX(startX + (currentX - holdX!));
      setHoldX(undefined);

      // Update x if an update is necessary
    } else if (props.shouldUpdateX) {
      updateX();
    }
  });

  // Drag api handlers
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    setStartX(event.clientX);
  };
  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    if (holdX === undefined) {
      currentTab.style.left = event.clientX - startX + "px";
      currentTab.style.zIndex = "1";

      const currentX = currentTab.getBoundingClientRect().x;

      // Position goes negative after swap
      // If this happens, do not report x position
      if (currentX < 0) {
        return;
      }
      const swapped = props.onDrag!(currentX, props.positionIndex);
      if (swapped) {
        setHoldX(currentX);
      }
    }
  };
  const handleDragEnd = (event: React.DragEvent) => {
    const tabStyle = currentTab.style;
    tabStyle.left = "0px";
    tabStyle.zIndex = "";
  };

  return (
    <Tab
      ref={tabRef as React.RefObject<any>}
      className={`${classes.tab} ${open && classes.tabOpened} ${
        close && classes.tabClosed
      }`}
      classes={{
        wrapper: classes.wrapper,
        selected:
          props.positionIndex === props.currentValue
            ? classes.selected
            : undefined
      }}
      draggable={draggable}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      label={
        <ChromeTabLabel
          label={props.label}
          onClose={props.onClose === undefined ? undefined : handleClose}
        />
      }
      selected={props.positionIndex === props.currentValue}
      {...a11yProps(props.positionIndex)}
      value={props.positionIndex}
      disableTouchRipple={true}
      disableFocusRipple={true}
      onMouseDown={handleMouseDown}
      component={Link}
      to={props.url}
    />
  );
};

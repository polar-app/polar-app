import * as  React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";


const ActionList = () => {
    return (
        <Paper elevation={3}>
            <MenuList>
                <MenuItem selected={true}>
                    <ListItemText primary="hello world"/>
                </MenuItem>
                <MenuItem>
                    <ListItemText primary="hello world"/>
                </MenuItem>
            </MenuList>
        </Paper>
    )
}


export const ActionMenuStory = () => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [active, setActive] = React.useState(false);

    const onRef = React.useCallback((element: HTMLDivElement | null) => {
        ref.current = element;
        if (element !== null) {
            setActive(true);
        }
    }, [])

    // TODO the width and height don't really work here...

    return (
        <div ref={onRef}>
            {active && (
                <ActionList/>
                // <Menu
                //     id="fade-menu"
                //     keepMounted
                //     anchorEl={ref.current}
                //     open={true}
                //     style={{height: '400px', width: '300px'}}>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                //     <MenuItem>Profile</MenuItem>
                //     <MenuItem>My account</MenuItem>
                //     <MenuItem>Logout</MenuItem>
                // </Menu>
            )}
        </div>
    );


}
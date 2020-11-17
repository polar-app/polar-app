import * as  React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";


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
                <Menu
                    id="fade-menu"
                    keepMounted
                    anchorEl={ref.current}
                    open={true}
                    style={{height: '400px', width: '300px'}}>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                </Menu>
            )}
        </div>
    );


}
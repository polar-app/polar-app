import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import * as React from 'react';
import {ChromeExtensionInstallButton, useWebExtensionInstalled} from "./ChromeExtensionInstallButton";

export const ChromeExtensionInstallBar = () => {

    const webExtensionInstalled = useWebExtensionInstalled();

    if (webExtensionInstalled) {
        return null;
    }

    return (
        <Box ml={1} mr={1} mt="auto" mb="auto">
            <ChromeExtensionInstallButton/>
            <Divider/>
        </Box>
    )

}

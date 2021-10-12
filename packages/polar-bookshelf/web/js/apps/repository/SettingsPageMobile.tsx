import * as React from 'react';
import {useContext} from 'react';
import Divider from '@material-ui/core/Divider';
import {createStyles, makeStyles} from "@material-ui/core";
import { MUIThemeTypeContext } from '../../../../web/js/mui/context/MUIThemeTypeContext';
import { DefaultPageLayout } from '../../../../apps/repository/js/page_layout/DefaultPageLayout';
import { SettingToggle } from '../../../../apps/repository/js/configure/settings/SettingToggle';
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import { usePrefsContext } from '../../../../apps/repository/js/persistence_layer/PrefsContext2';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            margin: '16px 0',
            '& h1, & h2, & h3, & h4, & h5': {
                margin: 0,
            }
        },
        padded: {
            margin: '0 16px'
        }
    }),
);


export const SettingsPageMobile = React.memo(function SettingsPageMobile() {
    const classes = useStyles();
    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };

    return(
        <DefaultPageLayout>
            <SettingToggle title="Dark Mode"
                description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                name="dark-mode"
                icon={<BrightnessMediumIcon />}
                defaultValue={theme === 'dark'}
                prefs={prefs}
                onChange={handleDarkModeToggle}
            />
        </DefaultPageLayout>
    );
});
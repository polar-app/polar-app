import * as React from "react";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import { deepMemo } from "../react/ReactUtils";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";

const WIDTH = 72;
const BORDER = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            // borderRadius: '5px',
            width: `${WIDTH - (BORDER * 2)}px`,

            borderLeftWidth: `${BORDER}`,
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',

            borderRightWidth: `${BORDER}`,
            borderRightStyle: 'solid',
            borderRightColor: 'transparent',

            marginBottom: '5px',
            cursor: 'pointer',

            "& img": {
                width: `${WIDTH - (BORDER * 2)}px`,
                borderRadius: '5px',
            },
            '&:hover': {
                borderLeftColor: theme.palette.secondary.main
            },

        },
        activeButton: {
            borderLeftColor: theme.palette.secondary.main
        },
        logo: {
            display: 'flex',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        divider: {
            marginBottom: '5px',
        }
    }),
);

interface IProps {
    readonly tab: TabDescriptor;

}

export const SideNavButtonWithThumbnail = deepMemo(function SideNavButtonWithThumbnail(props: IProps) {

    const {tab} = props;
    const {activeTab} = useSideNavStore(['tabs', 'activeTab']);
    const {setActiveTab} = useSideNavCallbacks();
    const classes = useStyles();

    const active = tab.id === activeTab;

    const Title = () => {
        return (
            // <div>
            //     {tab.title}
            // </div>

            <Card>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt={tab.title}
                        height="200"
                        style={{
                            objectPosition: "0% 0%"
                        }}
                        image={tab.image?.url}
                        title={tab.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {tab.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }

    return (
        <div>
            <Tooltip placement="right"
                     enterDelay={0}
                     leaveDelay={0}
                     arrow={true}
                     PopperProps={{
                         style: {
                             display: active ? 'none' : undefined
                         }
                     }}
                     title={<Title/>}>

                <div onClick={() => setActiveTab(tab.id)}
                     className={clsx(classes.button, active && classes.activeButton)}>
                    {tab.icon}
                </div>
            </Tooltip>
        </div>
    );
});

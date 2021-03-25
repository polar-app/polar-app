import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 300,
        maxHeight: 350,
    },
});

interface IProps {
    readonly title: string;
    readonly imgURL: string;
    readonly description: string;
}

export const DocCard = React.memo(function DocCard(props: IProps) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt={props.title}
                    height="150"
                    style={{
                        objectPosition: '50% top'
                    }}
                    image={props.imgURL}
                    title={props.title}
                />
                <CardContent>
                    <Typography gutterBottom
                                variant="h6"
                                component="h6"
                                style={{
                                    lineHeight: '1.2em'
                                }}>
                        {props.title}
                    </Typography>
                    <Typography variant="body2"
                                color="textSecondary"
                                component="p"
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                        {props.description}
                    </Typography>

                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Open
                </Button>
            </CardActions>
        </Card>
    );
});

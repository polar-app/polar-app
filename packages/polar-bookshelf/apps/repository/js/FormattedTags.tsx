import * as React from 'react';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import Chip from "@material-ui/core/Chip";
import Grid from '@material-ui/core/Grid';

interface IProps {
    tags: {[id: string]: Tag};
}

export const FormattedTags = (props: IProps) => {

    const tags = props.tags;

    const chips = Tags.onlyRegular(Object.values(tags))
        .map(tag => tag.label)
        .sort()
        .map(tag =>
            <Grid key={tag} item>
                <Chip label={tag}
                      style={{userSelect: 'none'}}
                      size="small"/>
            </Grid>
        );

    return (
        <Grid spacing={1}
              container
              direction="row"
              justify="flex-start"
              alignItems="center">

            {chips}

        </Grid>
    );

};

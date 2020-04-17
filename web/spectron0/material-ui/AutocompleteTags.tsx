/* eslint-disable no-use-before-define */
import React, {useState} from 'react';
import Autocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason, createFilterOptions
} from '@material-ui/lab/Autocomplete';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Popper from "@material-ui/core/Popper";
import {Tag} from "polar-shared/src/tags/Tags";
import {isPresent} from "polar-shared/src/Preconditions";
import { arrayStream } from 'polar-shared/src/util/ArrayStreams';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 500,
            // marginTop: theme.spacing(1),
        },
    }),
);

interface CreateTagOption {
    readonly inputValue: string;
    readonly label: string;
}

function isCreateTagOption(tagOption: TagOption): tagOption is CreateTagOption {
    return isPresent((tagOption as any).inputValue);
}

type TagOption = CreateTagOption | Tag;

interface TagMap {
    [id: string]: TagOption;
}

export default function AutocompleteTags() {

    const classes = useStyles();

    const [values, setValues] = useState<TagMap>({});

    // FIXME: handle key down when in create mode, then add the new item to the
    // list, and add it to the selected values..

    const handleOptionCreated = () => {
        console.log('option created');
    };

    const handleChange = (event: React.ChangeEvent<{}>,
                          newValues: TagOption | null | TagOption[],
                          reason: AutocompleteChangeReason,
                          details: AutocompleteChangeDetails<TagOption> | undefined) => {

        const convertToTagMap = (tagOptions: ReadonlyArray<TagOption>): TagMap => {

            return arrayStream(tagOptions)
                .map(current => {
                    if (isCreateTagOption(current)) {
                        return {
                            id: current.inputValue,
                            label: current.inputValue
                        }
                    } else {
                        return current;
                    }
                })
                .toMap(current => current.id);

        };

        if (newValues === null) {
            setValues({});
            return;
        }

        if (Array.isArray(newValues)) {
            setValues(convertToTagMap(newValues));
            return;
        }

        setValues(convertToTagMap([newValues]));

    };

    const filter = createFilterOptions<TagOption>();

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                // freeSolo
                value={Object.values(values)}
                options={[...tags]}
                getOptionLabel={(option) => option.label}
                defaultValue={[]}
                onChange={(event, value, reason, details) => handleChange(event, value, reason, details)}
                filterSelectedOptions
                filterOptions={(options, params) => {

                    const filtered = filter(options, params) as TagOption[];

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Create: "${params.inputValue}"`
                        });
                    }

                    return filtered;
                }}
                // noOptionsText={<Button onClick={() => handleOptionCreated()}>Create "{value}"</Button>}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Create or select tags"
                        placeholder=""
                    />
                )}
            />

        </div>
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const tags: ReadonlyArray<Tag> = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Godfather: Part II',
    'The Dark Knight',
    '12 Angry Men',
    "Schindler's List",
    'Pulp Fiction',
    'The Lord of the Rings: The Return of the King',
    'The Good, the Bad and the Ugly',
    'Fight Club',
    'The Lord of the Rings: The Fellowship of the Ring',
    'Star Wars: Episode V - The Empire Strikes Back',
    'Forrest Gump',
    'Inception',
    'The Lord of the Rings: The Two Towers',
    "One Flew Over the Cuckoo's Nest",
    'Goodfellas',
    'The Matrix',
    'Seven Samurai',
    'Star Wars: Episode IV - A New Hope',
    'City of God',
    'Se7en',
    'The Silence of the Lambs',
    "It's a Wonderful Life",
    'Life Is Beautiful',
    'The Usual Suspects',
    'Léon: The Professional',
    'Spirited Away',
    'Saving Private Ryan',
    'Once Upon a Time in the West',
    'American History X',
    'Interstellar',
    'Casablanca',
    'City Lights',
    'Psycho',
    'The Green Mile',
    'The Intouchables',
    'Modern Times',
    'Raiders of the Lost Ark',
    'Rear Window',
    'The Pianist',
    'The Departed',
    'Terminator 2: Judgment Day',
    'Back to the Future',
    'Whiplash',
    'Gladiator',
    'Memento',
    'The Prestige',
    'The Lion King',
    'Apocalypse Now',
    'Alien',
    'Sunset Boulevard',
    'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    'The Great Dictator',
    'Cinema Paradiso',
    'The Lives of Others',
    'Grave of the Fireflies',
    'Paths of Glory',
    'Django Unchained',
    'The Shining',
    'WALL·E',
    'American Beauty',
    'The Dark Knight Rises',
    'Princess Mononoke',
    'Aliens',
    'Oldboy',
    'Once Upon a Time in America',
    'Witness for the Prosecution',
    'Das Boot',
    'Citizen Kane',
    'North by Northwest',
    'Vertigo',
    'Star Wars: Episode VI - Return of the Jedi',
    'Reservoir Dogs',
    'Braveheart',
    'M',
    'Requiem for a Dream',
    'Amélie',
    'A Clockwork Orange',
    'Like Stars on Earth',
    'Taxi Driver',
    'Lawrence of Arabia',
    'Double Indemnity',
    'Eternal Sunshine of the Spotless Mind',
    'Amadeus',
    'To Kill a Mockingbird',
    'Toy Story 3',
    'Logan',
    'Full Metal Jacket',
    'Dangal',
    'The Sting',
    '2001: A Space Odyssey',
    "Singin' in the Rain",
    'Toy Story',
    'Bicycle Thieves',
    'The Kid',
    'Inglourious Basterds',
    'Snatch',
    '3 Idiots',
    'Monty Python and the Holy Grail',
].map(current => {
    return {
        id: current,
        label: current
    }
});

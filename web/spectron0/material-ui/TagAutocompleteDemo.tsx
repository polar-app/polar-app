import * as React from 'react';
import {MockTags} from "./MockTags";
import MUICreatableAutocomplete, {ValueAutocompleteOption} from "./autocomplete/MUICreatableAutocomplete";
import {Tag} from "polar-shared/src/tags/Tags";

const tags = MockTags.create();

const toAutocompleteOption = (tag: Tag): ValueAutocompleteOption<Tag> => ({
    id: tag.id,
    label: tag.label,
    value: tag
});

const tagOptions: ReadonlyArray<ValueAutocompleteOption<Tag>> = tags.map(toAutocompleteOption);

const createOption = (input: string): ValueAutocompleteOption<Tag> => ({
    id: input,
    label: input,
    value: {
        id: input,
        label: input,
    }
});

const defaultOptions = tagOptions.slice(0, 2);

export const TagAutocompleteDemo = () => (

    <div style={{margin: '10px'}}>
        <MUICreatableAutocomplete label="Create or select tags: "
                                  autoFocus
                                  options={tagOptions}
                                  defaultOptions={defaultOptions}
                                  onChange={selected => console.log('selected: ', selected)}
                                  createOption={createOption}/>
    </div>
);



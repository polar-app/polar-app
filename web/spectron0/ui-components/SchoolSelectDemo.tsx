import AsyncSelect from 'react-select/async';
import * as React from "react";
import {Universities, University} from "polar-shared/src/util/Universities";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {isPresent} from "polar-shared/src/Preconditions";

const LIMIT = 25;

interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

const universities
    = arrayStream(Universities.get())
        .sort(((a, b) => a.name.localeCompare(b.name)))
        .collect();

function toOption(university: University): IOption<University> {
    return {
        value: university,
        label: university.name
    };
}

const options: ReadonlyArray<IOption<University>>
    = arrayStream(universities)
        .map(toOption)
        .collect();

type OptionsCallback<T> = (options: ReadonlyArray<IOption<T>>) => void;

function loadOptions(inputValue: string, callback: OptionsCallback<University>) {
    callback(Loader.filter(inputValue));
}

class Loader {

    public static defaultOptions() {

        // no real query string so just return the top items.
        return arrayStream(options)
            .head(LIMIT)
            .collect();

    }

    public static filter(inputString: string) {

        if (! inputString || inputString.trim() === '') {
            this.defaultOptions();
        }

        const predicate = (option: IOption<University>) => {

            return isPresent(option.label) &&
                option.label.toLowerCase().indexOf(inputString.toLowerCase()) !== -1;

        };

        return arrayStream(options)
            .filter(predicate)
            .head(LIMIT)
            .collect();
    }

}

export const SchoolSelectDemo = () => (
    <AsyncSelect
        isClearable
        autoFocus
        cacheOptions
        placeholder="Select a university..."
        defaultOptions={Loader.defaultOptions()}
        loadOptions={loadOptions}
        // onKeyDown={event => props.onKeyDown(event)}
        // onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
        // value={props.pendingTagOptions}
        // defaultValue={props.pendingTagOptions}
    />
);


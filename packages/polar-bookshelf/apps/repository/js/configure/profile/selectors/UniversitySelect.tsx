import * as React from "react";
import {Universities, University} from "polar-shared/src/util/Universities";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {isPresent} from "polar-shared/src/Preconditions";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { AutocompleteRenderGroupParams } from "@material-ui/lab/Autocomplete";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import {nullToUndefined} from "polar-shared/src/util/Nullable";

// use a large limit so that the user sees a bunch of universities and then
// realizes that they need to type for it...
const LIMIT = 250;

export interface IOption<T> {
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

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + LISTBOX_PADDING,
        },
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}>
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

const renderGroup = (params: AutocompleteRenderGroupParams) => params.children;
    // <ListSubheader key={params.key} component="div">
    //     {params.group}
    // </ListSubheader>,
    // params.children,
// ];

interface IProps {
    readonly placeholder?: string;
    readonly onSelect: (option: IOption<University> | undefined) => void;
}

const groupByFunction = (option: IOption<University>) => option.value.name[0].toUpperCase();

const optionsComparator = (a: IOption<University>, b: IOption<University>) => {
    return groupByFunction(a).localeCompare(groupByFunction(b));
}

export const UniversitySelect = (props: IProps) => {

    const sortedOptions = React.useMemo(() => [...options].sort(optionsComparator), []);

    return (
        <Autocomplete
            style={{ flexGrow: 1 }}
            onChange={(event, option) => props.onSelect(nullToUndefined(option))}
            disableListWrap
            ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
            getOptionLabel={(option) => option.label}
            renderGroup={renderGroup}
            options={sortedOptions}
            groupBy={groupByFunction}
            renderInput={(params) => <TextField {...params} variant="outlined" label="... and studies at" />}
            renderOption={(option) => <Typography noWrap>{option.label}</Typography>}
        />
    )

    // return (
    //     <Autocomplete
    //         options={[...options]}
    //         getOptionLabel={(option) => option.label}
    //         renderInput={(params) => <TextField {...params} label="What university?" variant="outlined" />}
    //     />
    // );
    // return (
    //     <AsyncSelect
    //         isClearable
    //         autoFocus
    //         cacheOptions
    //         placeholder={props.placeholder ?? "Search from nearly 10k universities..."}
    //         defaultOptions={Loader.defaultOptions()}
    //         loadOptions={loadOptions}
    //         onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
    //         // onKeyDown={event => props.onKeyDown(event)}
    //         // onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
    //         // value={props.pendingTagOptions}
    //         // defaultValue={props.pendingTagOptions}
    //         />
    // );

};


import * as React from 'react';
import {Logger} from "polar-shared/src/logger/Logger";
import {Tag, TagStr} from "polar-shared/src/tags/Tags";
import {
    GroupProvisionRequest,
    GroupProvisions
} from "../../../../../web/js/datastore/sharing/rpc/GroupProvisions";
import {Toaster} from "../../../../../web/js/ui/toaster/Toaster";
import {RelatedTagsManager} from "../../../../../web/js/tags/related/RelatedTagsManager";
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const log = Logger.create();

export class CreateGroupForm extends React.Component<IProps, IState> {

    private readonly formData: FormData = {
        name: "",
        description: "",
        tags: []
    };

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onTags = this.onTags.bind(this);
        this.onDone = this.onDone.bind(this);

        this.state = {
        };

    }

    public render() {
        return (

            <div className="container">

                <div className="row">

                    <div className="col">

                        <h1>Create Group</h1>

                        <p>
                            Create a new group for sharing documents and collaborating
                            with others.
                        </p>

                        <InputLabel htmlFor="create-group-name">Name</InputLabel>

                        <Input type="text"
                               name="name"
                               id="create-group-name"
                               placeholder="Name of group"
                               required
                               onChange={event => this.formData.name = event.currentTarget.value}
                               />

                        <InputLabel htmlFor="create-group-description">Description</InputLabel>

                        <Input type="textarea"
                               name="description"
                               id="create-group-description"
                               placeholder="A description for the group"
                               onChange={event => this.formData.description = event.currentTarget.value}
                               />

                        <InputLabel>Tags</InputLabel>

                        {/*<TagInputWidget availableTags={this.props.tagsProvider()}*/}
                        {/*                existingTags={[]}*/}
                        {/*                relatedTags={this.props.relatedTags}*/}
                        {/*                onChange={(tags) => this.onTags(tags)}/>*/}

                        <p className="text-secondary text-sm mt-1">
                            Select up to 5 tags for this group.  Tags will be
                            used by others to find your group.
                        </p>

                        <div className="text-right">

                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => this.onDone()}>
                                Create Group
                            </Button>

                        </div>

                    </div>
                </div>
            </div>

        );
    }

    private onTags(tags: Tag[]) {
        this.formData.tags = tags.map(current => current.label);
    }

    private onDone() {

        // TODO: first validate the name and that it looks acceptable...

        const doGroupProvision = async () => {

            Toaster.info("Creating your new group. Just a moment...");

            const request: GroupProvisionRequest = {
                ...this.formData,
                docs: [],
                visibility: 'public',
                invitations: {
                    message: "",
                    to: []
                }
            };

            await GroupProvisions.exec(request);

            // TODO: redirect RIGHT to the new group so they can start adding
            // documents there.
            Toaster.success("Your new group has been created!");

        };

        doGroupProvision()
            .catch(err => log.error(err));

    }


}

export interface FormData {
    name: string;
    description: string;
    tags: ReadonlyArray<TagStr>;
}

export interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly relatedTags: RelatedTagsManager;
}

export interface IState {

}

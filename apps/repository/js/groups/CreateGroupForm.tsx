import * as React from 'react';
import Input from "reactstrap/lib/Input";
import {Form} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import {Tag, TagStr} from "../../../../web/js/tags/Tags";
import {RelatedTags} from "../../../../web/js/tags/related/RelatedTags";
import {TagInputWidget} from "../TagInputWidget";
import Button from "reactstrap/lib/Button";
import {Logger} from "../../../../web/js/logger/Logger";

const log = Logger.create();

export class CreateGroupForm extends React.Component<IProps, IState> {

    private readonly formData: FormData = {
        name: "",
        description: "",
        tags: []
    };

    constructor(props: IProps, context: any) {
        super(props, context);

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

                        <Form>
                            <FormGroup>
                                <Label for="create-group-name">Name</Label>

                                <Input type="text"
                                       name="name"
                                       id="create-group-name"
                                       placeholder="Name of group"
                                       onChange={event => this.formData.name = event.currentTarget.value}
                                       />

                            </FormGroup>

                            <FormGroup>
                                <Label for="create-group-description">Description</Label>

                                <Input type="textarea"
                                       name="description"
                                       id="create-group-description"
                                       placeholder="A description for the group"
                                       onChange={event => this.formData.description = event.currentTarget.value}
                                       />
                            </FormGroup>

                            <FormGroup>

                                <Label>Tags</Label>

                                <TagInputWidget availableTags={this.props.tagsProvider()}
                                                existingTags={[]}
                                                relatedTags={this.props.relatedTags}
                                                onChange={(tags) => this.formData.tags = tags.map(current => current.label)}/>

                                <p className="text-secondary text-sm mt-1">
                                    Select up to 5 tags for this group.  Tags will be
                                    used by others to find your group.
                                </p>

                            </FormGroup>

                            <div className="text-right">

                                <Button color="primary"
                                        size="md"
                                        onClick={() => this.onDone()}>
                                    Create Group
                                </Button>

                            </div>

                        </Form>
                    </div>
                </div>
            </div>

        );
    }

    private onDone() {
        // noop for now...
        log.info("Going to send data to create group: " , this.formData);
    }


}

export interface FormData {
    name: string;
    description: string;
    tags: ReadonlyArray<TagStr>;
}

export interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly relatedTags: RelatedTags;
}

export interface IState {

}

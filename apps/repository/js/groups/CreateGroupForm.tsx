import * as React from 'react';
import Input from "reactstrap/lib/Input";
import {Form} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import {Tag} from "../../../../web/js/tags/Tags";
import {RelatedTags} from "../../../../web/js/tags/related/RelatedTags";
import {TagInputWidget} from "../TagInputWidget";
import Button from "reactstrap/lib/Button";

export class CreateGroupForm extends React.Component<IProps, IState> {

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
                                <Input type="text" name="name" id="create-group-name" placeholder="Name of group" />
                            </FormGroup>

                            <FormGroup>
                                <Label for="create-group-description">Description</Label>
                                <Input type="textarea" name="description" id="create-group-description" placeholder="A description of the group" />
                            </FormGroup>

                            <FormGroup>

                                <Label>Tags</Label>

                                <TagInputWidget availableTags={this.props.tagsProvider()}
                                                existingTags={[]}
                                                relatedTags={this.props.relatedTags}
                                                onChange={(tags) => console.log('got tags: ', tags)}/>

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

    }


}

export interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly relatedTags: RelatedTags;
}

export interface IState {

}

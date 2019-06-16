
export interface GroupInit {

    /**
     * When specified, use the given group name.
     */
    readonly name?: string;

    /**
     * Must set the group visibility here so that we inherit the right value.
     */
    readonly visibility: GroupVisibility;

    readonly tags?: ReadonlyArray<TagStr>;

}

export type GroupVisibility = 'private' | 'protected' | 'public';

export type TagStr = string;

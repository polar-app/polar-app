import {Sets} from "polar-shared/src/util/Sets";

/**
 * Stores members associated with a key.
 *
 * For example, parents and children.
 */
export class KeyMemberSet<K, V> {

    private members = new Set<V>();

    public constructor(public readonly key: K) {
    }

    public add(member: V) {
        this.members.add(member);
    }

    public set(members: ReadonlyArray<V>) {
        this.members = new Set<V>(members);
    }

    public delete(member: V) {
        this.members.delete(member);
    }

    public count() {
        return this.members.size;
    }

    public toArray() {
        return Sets.toArray(this.members);
    }

}

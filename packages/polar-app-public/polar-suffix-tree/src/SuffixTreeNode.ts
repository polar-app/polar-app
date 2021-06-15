
class SuffixTreeNode {

    public transition: any = {};
    public suffixLink: any = null;

    // TODO: use proper types here
    public addTransition(node: any, start: any, end: any, t: any): any {
        this.transition[t] = [node, start, end];
    }

    public isLeaf() {
        return Object.keys(this.transition).length === 0;
    }

}

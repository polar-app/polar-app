//
// https://github.com/maclandrol/SuffixTreeJS/blob/master/ukkonen.js
//
// Original was MIT licensed so compatible with our license

// This implementation is adapted from the one here the snippets provided here
// http://www.allisons.org/ll/AlgDS/Tree/Suffix/

class SuffixTree {
    private text = '';
    // tslint:disable-next-line:variable-name
    private str_list: any[] = [];

    private seps: any[] = []
    private root = new SuffixTreeNode();
    private bottom = new SuffixTreeNode();
    private s = this.root;
    private k = 0;
    private i = -1;

    constructor() {
        this.root.suffixLink = this.bottom;
    }

    public addString(str: string) {
        const temp = this.text.length;
        this.text += str;
        this.seps.push(str[str.length-1])
        this.str_list.push(str);
        let s, k, i;
        s = this.s;
        k = this.k;
        i = this.i;

        for (let j = temp; j < this.text.length; j++) {
            this.bottom.addTransition(this.root, j, j, this.text[j]);
        }

        while(this.text[i+1]) {
            i++;
            let up = this.update(s, k, i);
            up = this.canonize(up[0], up[1], i);
            s = up[0];
            k = up[1];
        }

        this.s = s;
        this.k = k;
        this.i = i;
        return this;
    }

    private update(s: any, k: any, i: any) {

        let oldr = this.root;
        let endAndr= this.testAndSplit(s, k, i - 1, this.text[i]);
        let endPoint = endAndr[0]; var r = endAndr[1]

        while(!endPoint) {
            r.addTransition(new SuffixTreeNode(), i, Infinity, this.text[i]);

            if(oldr !== this.root) {
                oldr.suffixLink = r;
            }

            oldr = r;
            let sAndk = this.canonize(s.suffixLink, k, i - 1);
            s = sAndk[0];
            k = sAndk[1];
            endAndr = this.testAndSplit(s, k, i - 1, this.text[i]);
            endPoint = endAndr[0]; var r = endAndr[1]
        }

        if(oldr !== this.root) {
            oldr.suffixLink = s;
        }

        return [s, k];
    }

    public testAndSplit(s: any, k: any, p: any, t: any) {
        if(k <= p) {
            const traNs = s.transition[this.text[k]];
            let s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];
            if(t === this.text[k2 + p - k + 1]) {
                return [true, s];
            } else {
                let r = new SuffixTreeNode();
                s.addTransition(r, k2, k2 + p - k, this.text[k2]);
                r.addTransition(s2, k2 + p - k + 1, p2, this.text[k2 + p - k + 1]);
                return [false, r];
            }
        } else {
            if(!s.transition[t])
                return [false, s];
            else
                return [true, s];
        }
    }

    public canonize(s: any, k: any, p: any) {
        if(p < k)
            return [s, k];
        else {
            var traNs = s.transition[this.text[k]];
            var s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];

            while(p2 - k2 <= p - k) {
                k = k + p2 - k2 + 1;
                s = s2;

                if(k <= p) {
                    var traNs = s.transition[this.text[k]];
                    s2 = traNs[0]; k2 = traNs[1]; p2 = traNs[2];
                }
            }

            return [s, k];
        }
    }

}

//
// SuffixTree.prototype.convertToJson = function(){
//     // convert tree to json to use with d3js
//
//     var text = this.text;
//     var ret = {
//         "name" : "",
//         "parent": "null",
//         "suffix" : "",
//         "children": []
//     }
//
//     function traverse(node, seps, str_list, ret) {
//         for(var t in node.transition) {
//             var traNs = node.transition[t];
//             var s = traNs[0], a = traNs[1], b = traNs[2];
//             var name =  text.substring(a, b + 1);
//             var position = seps.length-1;
//             for(var pos=name.length -1; pos>-1; pos--){
//                 var insep = seps.indexOf(name[pos]);
//                 position = insep>-1 ?insep:position;
//             }
//
//             var names = name.split(seps[position]);
//             if (names.length >1){
//                 name = names[0] + seps[position];
//             }
//             var suffix =  ret["suffix"]+name;
//             var cchild = {
//                 "name" : name,
//                 "parent": ret['name'],
//                 "suffix" : suffix,
//                 "children": []
//             };
//             if (s.isLeaf()){
//                 cchild['seq'] = position +1;
//                 cchild['start'] = ""+(str_list[position].length - suffix.length);
//             }
//             cchild = traverse(s, seps, str_list, cchild);
//             ret["children"].push(cchild)
//         }
//
//         return ret;
//
//     }
//     console.log(this.seps);
//     return traverse(this.root, this.seps, this.str_list, ret);
//
// }
//
// SuffixTree.prototype.toString = function() {
//     var text = this.text;
//
//     function traverse(node, offset, ret) {
//         offset = typeof offset !== 'undefined' ? offset : '';
//         ret = typeof ret !== 'undefined' ? ret : '';
//         for(var t in node.transition) {
//             var traNs = node.transition[t];
//             var s = traNs[0], a = traNs[1], b = traNs[2];
//             ret += offset + '["' + text.substring(a, b + 1) + '", ' + a + ', ' + b + ']' + '\r\n';
//             ret += traverse(s, offset+'\t');
//         }
//         return ret;
//     }
//     var res = traverse(this.root)
//     return res;
// }
//
// SuffixTree.prototype.print = function(){
//     console.log(this.toString());
// }

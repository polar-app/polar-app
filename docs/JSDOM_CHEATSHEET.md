### Some remarks when using with JSDOM

- Every node has a `.nodeType` property use constants with the `_NODE` suffix to do any node type checking:

```typescript
    if (node.nodeType == node.TEXT_NODE) {
        // do stuff...
    } 
```
- A `ChildNode` node that have the type `ELEMENT_NODE` can be safely casted to `HTMLElement`

```typescript
    if (node.nodeType == node.ELEMENT_NODE) {
        element = <HTMLElement> node;
    }
```

- The property `.childNodes` returns a `NodeListOf<ChildNode>` and not an array if you would like to use it as an array you will have to convert it first using:

```typescript
    Array.from(childNodes);
```


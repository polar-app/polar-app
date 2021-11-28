- bulk operations component in the table head
- need a filter bar and bulk operations bar 
- how do we inject useTableGridStore since it's generic?

- the main problems we have with making this a generalized component:
    - useTableGridStore has to be generic and that's a huge blocker...
      - internally we could just use strings but refactor the constructor to use types
      - 

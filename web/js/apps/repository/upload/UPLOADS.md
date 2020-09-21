This system enables bulk file uploads with the following features:

- support drag and drop and the file browse dialog
- uploads of directories recursively when the user selects a directory
- filters types based on mime type and file extension
- progress indicators as a file is being uploaded
- tags are computed on directories so the directory structure is mirrored

TODO: 
  - FIXME: the progress callbacks don't currently work and they stay indeterminate
  - It would be great if you could drop the files on a directory in the sidebar
  - Test on Safari
  - Test on Firefox
  - Test on Windows
  
  - How do we handle directory pruning?
    - we have no real way of knowing how a directory is being uploaded ... they 
      could be dragging the root or they could be dragging just one directory 
      and they still want to keep that path.  we could fix this by implementing
      a feature for dragging and dropping files in the hierarchy.

  - Folders and Tags don't show up unless Folders and Tags don't exist but
    they should just be empty items otherwise.

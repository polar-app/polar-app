# Firestore

We use the uid field right now to determine if a record can be written.

## Current Rules

```
// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }
  }
}
```

## Default Rules (after the initial install)
          
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```

## Reading data fields:

```

# Many apps store access control information as fields on documents in the
# database. Cloud Firestore Security Rules can dynamically allow or deny access
# based on document data:

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow the user to read data if the document has the 'visibility'
    // field set to 'public'
    match /cities/{city} {
      allow read: if resource.data.visibility == 'public';
    }
  }
}

```

# Cloud Storage

Our current security just stores the user ID in the document metadata and then
compares them.

```

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth.uid == resource.metadata.uid;
    }
  }
}


```


## Default rules 

```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

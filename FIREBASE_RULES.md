# Firestore

We use the uid field right now to determine if a record can be written.

## Rules with public visibility 

```
// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null && (resource == null || request.auth.uid == resource.data.uid || (resource.data.visibility == 'public' || resource.data.visibility == 2));
      allow write: if request.auth != null && (resource == null || request.auth.uid == resource.data.uid);
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

      // Allow read and write when the resource is missing OR the user is the 
      // owner of the resource. Note that it's important to allow both reads
      // and writes if the document is missing. If it's missing then want the 
      // user to create it and then own it.  If it is present then we want 
      // validate against the existing uid.  
        
      allow read, write: if request.auth != null && (resource == null || request.auth.uid == resource.metadata.uid);
      
    }
  }
}


```

## March 10 , 2019

I think we're going to change the rules to allow read if the visibility is public

I've confirmed that the storage of the metadata key is actually 'visibility' 
(lowercase) and that the string is actually 'public' (lowercase) 

```

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {

      // Allow read and write when the resource is missing OR the user is the 
      // owner of the resource. Note that it's important to allow both reads
      // and writes if the document is missing. If it's missing then want the 
      // user to create it and then own it.  If it is present then we want 
      // validate against the existing uid.  
      
      allow read: if request.auth != null && (resource == null || request.auth.uid == resource.metadata.uid || resource.metadata.visibility == 'public');
      allow write: if request.auth != null && (resource == null || request.auth.uid == resource.metadata.uid);
      
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

## 

https://firebase.google.com/docs/storage/security/start?authuser=0
https://firebase.google.com/docs/storage/security/secure-files?authuser=0#resource_evaluation

## Setup automated testing of our rules:

https://firebase.google.com/docs/firestore/security/test-rules-emulator


What to test

4x: GET, UPDATE, DELETE, CREATE

3x: with authenticated(owner), authenticated(not-owner) | unauthenticated

2x: with absent|present

This means we have 4x3x2 = 24 potential permissions states

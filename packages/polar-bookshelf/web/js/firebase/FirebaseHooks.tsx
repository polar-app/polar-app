import firebase from 'firebase/app'

export function useFirebaseAuth() {
    return firebase.auth();
}
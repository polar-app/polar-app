# Polar React Native

## Current State:

Tested only for android. The current 'debug.keystore' in _./android/app_ is
temporary and contains only placeholder info. A 'debug.keystore' needs to be
generated with BUCK using actual information before google store release.

## Android Setup

The standalone APK does compile via expo build:android does not work. It runs
with the error "Default Activity Not Found". However the non-standalone APK
functions.

### To Run from APK (non-standalone) via Android Studio:

1. Open android studio and make sure it is set to the configs as directed by
  "https://reactnative.dev/docs/0.6/getting-started".

2. Open an existing project, and select app-debug.apk at "polar-interns\will.kendall\React-native\native-test\android\app\build\outputs\apk\debug"

3. Use the AVD manager (A little icon of a phone with the green alien infront of it in the top right of the project window) to select an Android Virtual Device (AVD). You may have to install a new device; they're pretty heft on space too.
   - Make sure the AVD is running Android 9 (Pie) to solve compatibility issues.
4. Run this emulator by clicking the play button within the AVD managar.
5. Navigate to ".\polar-interns\will.kendall\React-native\native-test\" in your terminal.
6. Run
   `npm run android`
7. The app should build install and open on your emulator.
   - However, this is just running from the repo. We just needed to start the server.
8. Delete the app off the emulator.
9. Run the APK in android studio with the green run button.

### To run from cloned Repo:

1. Open android studio and make sure it is set to the configs as directed by "https://reactnative.dev/docs/0.6/getting-started".
2. Open any project, we just need to run an emulator.
3. Use the AVD manager (A little icon of a phone with the green alien infront of it in the top right of the project window) to select an Android Virtual Device (AVD). You may have to install a new device, theyre pretty heft on space too.
   - Make sure the AVD is running Android 9 (Pie) to solve compatibility issues.
4. Run this emulator by clicking the play button within the AVD managar.
5. Navigate to ".\polar-interns\will.kendall\React-native\native-test\" in your terminal.
6. Run
   `npm run android`
7. The app should install and open on your emulator.

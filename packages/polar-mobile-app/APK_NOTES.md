 tacked this on to the end of the README in polar-interns/will.kendall/react-native/native-test. The steps under the headers "Setting up Gradle variables" and "Adding signing config to your app's Gradle config" have already been completed on the version in polar-interns. However, you should generate a new keystore anyway, and that will change some of the information filled in during these steps. I didn't run into any bugs in this part of the tutorial, hopefully you will find it just as easy!
-----------------------------------------------------------
### Generating a Release APK or AAB

The generation of both an APK and an AAB is covered in the react-native documentation here: [Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)

#### AAB general info

[AAB in Android Dev docs](https://developer.android.com/guide/app-bundle)
An overview from these docs:
An Android App Bundle (AAB) is a publishing format that includes all your app’s compiled code and resources, and defers APK generation and signing to Google Play.

Google Play uses your app bundle to generate and serve optimized APKs for each device configuration, so only the code and resources that are needed for a specific device are downloaded to run your app. You no longer have to build, sign, and manage multiple APKs to optimize support for different devices, and users get smaller, more-optimized downloads.

##### Testing the Generated AAB

I did not test the generated AAB, but [this tutorial](https://developer.android.com/studio/command-line/bundletool) through android developer docs details the process of using bundletool to test the AAB.

#### APK general info

[APK in Android Dev docs](https://developer.android.com/guide/components/fundamentals)
An overview from these docs:
Android apps can be wreitten using Kotlin, Java, and C++ languages. The Android SDK tools compile your code along with any data and resource files into an APK, an Android package, which is an archive file with an .apk suffix. One APK file contains all the contents of an Android app and is the file that Android-powered devices use to install the app.

##### Testing the Gnerated APK

(After completing the "Publishing to Google Play Tutorial" through to the "Testing the release build of your app" header)

1. Open android studio
2. Under `file` select "Profile or debug APK"
3. Select the recently generated app-release.apk which should be located in `android/app/build/outputs/apk/release` in your project directory
4. Give android studio a moment to index the file, then click the green run button to the right of the selected emulation device in the right third of the top of the window to install and run the apk on your emulator.

#### Issues encountered in this tutorial

##### Permissions

Running command prompt without administrator permissions resulted in `EPERM: Operation nor permitted` with nodewatcher error no. -4048

##### Error: SHA-1 for this file is not computed

Fixed by updating react-native-cli: `npm install -i -g --force react-native-cli`
---------------------------------------------------------------------------------------------------

Feel free to reach out with any questions!

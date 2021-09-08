We need an easy way to have user prefs and feature toggles.  

A feature toggle is a way to opt-in to new functionality without having to turn off our old functionality.

Right now we have the following hooks and components

usePrefsContext()

this gets all the user prefs and the ability to manipulate the prefs.

In order to determine the value of a feature toggle you can call:

```typescript jsx
/**
 * Return true/false based on a feature toggle name.
 *
 * @param featureName
  */
  export function useFeatureToggle(featureName: string): boolean {

```

And if you want to selectively enable something based on a feature toggle use the <LocalStorageFeatureToggle> component.

```typescript jsx
/**
  * Only render the child component if a feature toggle is enabled.
  */
  export const LocalStorageFeatureToggle = React.memo((props: IFeatureToggleProps) => {
```

If you want to change the value of a feature toggle you can call:

```typescript jsx
/**
  * Return a feature toggler function so that we can change the value of a feature toggle.
  */
  export function useFeatureToggler(): (featureName: string) => Promise<void> {
```

To turn on a feature toggle the user is given a URL of:

https://app.getpolarized.io/enable-feature-toggle?name=foo

Where the feature we're trying to toggle is named 'foo' at which point the toggle is enabled and the app reloaded.


# Feature Toggles

We use feature toggles to push new features into production that haven't yet
been approved / finalized by design or that maybe not be ready for general consumption.

Feature toggles are usually reserved for the Polar team but there are no
security issues here other than revealing features which may be shipped in the
near future.

If you haven't used feature toggles before read this quick page on Wikipedia:

https://en.wikipedia.org/wiki/Feature_toggle

Our system supports the following features:

- A centralized registry for all our feature toggles.
- Support for default feature toggles so that we can turn on features for everyone all at once yet support reverting if those features don't work
- Only know feature toggles can be enabled via code.  If you have the wrong key you can't work with that feature toggle.
- Components for Feature, FeatureEnabled and FeatureDisabled to make working with features easier.
- Hooks for working with features.
- RTL tests!
- Should for enumerating all feature toggles so that we can have them a tab under settings.  
- Ability to reset feature toggles to the default.
- Feature toggles are stored in prefs so if they follow you across devices and you can enable them on phone, tablet, and desktop.
- A feature can be under multiple feature toggle names. This can be used to enable a specific feature but also as a collection of larger features.  This allows us to put a feature under a higher level feature toggle like "design-milestone-1" but also "new-bottom-navigation" so that we can enable either.
- Features have metadata including a title and a description so that it's clear what that feature does before you enable it.

## Specifying a Design Milestone

To avoid user interaction / design bugs we try to place feature toggles under a
main design milestone so that we can enable a new design all at once.

This also allows us to iterate rapidly by pushing code often without breaking anything in the current UI, allows us 
to test out new things, then we can enable a design milestone all at once.

This is done by giving a feature toggle multiple features so that a larger one can be enabled.

For example:

```typescript jsx

<FeatureEnabled feature={['design-m0', 'new-fancy-bottom-navigation']}>
    <NewFancyBottomNavigation/>
</FeatureEnabled>

```

## Matrix of Feature Enable/Disable State based on Settings

                | user unset | user on | user off |
                |------------|---------|----------|
default off     |    off     |   on    |  off     |
default on      |    on      |   on    |  off     |
production (on) |    on      |   on    |  on      | (feature toggle removed here and old code removed)

## Lifecycle

The following should  be the lifecycle of a new feature in production

1. Feature implemented behind a feature toggle, default is off.  User may opt in during this phase and manually turn on the feature.
2. Once feature is approved, we turn it on by default.
3. During this stage users can opt out by turning the feature off. This would only happen if the feature is broken or our users don't like this new feature.
4. We remove the feature toggle, and it's in production by default.

# Code

The following components are implemented

```typescript jsx
<Feature feature="answers" enabled={<FancyNewFeature/>} disabled={<LameOldFeature/>}/>
```

... or you can just use FeatureEnabled

```typescript jsx
<FeatureEnabled feature="answers">
    <FancyNewFeature/>
</FeatureEnabled>
```

... or you can just use FeatureDisabled

```typescript jsx
<FeaturDisabled feature="answers">
    <LameOldFeature/>
</FeaturDisabled>
```


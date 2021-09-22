We have a dedicated app for 'stories' , similar to StoryBoook, that allows us to
create a registry of components showing off various states and to test / debug
them visually.

You can see this in action at:

https://app.getpolarized.io/apps/stories/

In order to make it faster we're building it via a dedicated webpack
configuration so that when it recompiles it's much faster.

Stories are registered in StoriesApp.tsx, then they are shown by name in the sidebar.

You can run it via:

export WEBPACK_BUNDLE=stories
yarn run webpack-serve

Then load:

http://localhost:8051/apps/stories/

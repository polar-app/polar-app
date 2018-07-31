This is a client/service system that allows a Renderer to create a slaved
window.

The DialogWindowService runs in the main eletron process.

the DialogWindowCleint is created in a renderer and then sends messages to the
DialogWindowService to create windows and send messages to them.

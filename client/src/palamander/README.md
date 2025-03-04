# Palamander Module

This module contains the standalone code that defines a Palamander. It is agnostic of any APIs - it's simply Typescript that creates objects that represent a Pal that can be dynamically updated.

### Organization
The [movement](./movement/) sub-directory deals with the overall movement of the whole Pal - specifically, how fast it is moving forward and how fast it is spinning.

The [morphology](./morphology) sub-directory deals with the Pal structure and any movement within the Pal (wriggling, twisting due to a turn, etc).

### Balancing Performance, Complexity and Realism
Most games run at 30 or 60 FPS - that means rendering an updated image every 17 or 34 ms. This is not a game, but aiming for this approximate range creates smooth, clean movement. As such, we needed to build a framework that allows the runtime (in particular a browser window that's already running a website) to update every segment of every Pal in this time window without introducing significant overhead.

At the same time, we want the Pals to move in a satisfying, natural, and flexible way. We need to store enough data and run enough calculations so that their behavior doesn't feel uncanny.

The code in this folder and its sub-directories is the heart of the Palamander Zoo project, and it seeks to find the happy median between these two opposing goals.

### The Palamander Update Loop
A Palamander's behavior cannot be statelessly determined - if it were, the resulting movement would look jerky and unnatural, with no sense of momentum or acceleration. This means that a full update cycle must complete within our desired frametime period, so that the new Palamander state is ready at the start of the next update.

We also need measures in place when we fall behind our update frequency. Even if this code is generally performant, there could be times during which the browser hits an unrelated bottleneck that pauses us too.

This is not a unique problem - it's a fundamental issue that can be solved with the [game loop](https://gameprogrammingpatterns.com/game-loop.html#the-pattern) design pattern. We've implemented an update loop that appropriately accounts for residual lag in [palamander.ts](./palamander.ts)

### Center of Mass
All Pal movement is centered on its center of mass. Any rotations will rotate the body around that point, and any forward movement will translate the center of mass coordinate by an appropriate ammount. Many of the helper functions in [palamander.ts](./palamander.ts) deal with finding an approximation of the center of mass efficiently and manipulating the Pal accordingly. TODO(mellow): This code likely belongs in a sub-module.

### Tightly-Coupled Entrypoints
We said above that this code is standalone. That's true for everything except [create-palamander.ts](./create-palamander.ts). This expects certain Pal type definitions to exist as JSON in a `public` output directory.

In addition [palamander-range.ts] (./palamander-range.ts) is only relevant if this code is meant to be rendered in-browser.

Think of these two files as convenience wrappers around the `palamander` module that allow us to use it more easily for our purposes. You could easily copy this whole directory into, say, a Node runtime that creates a folder of image files by drawing circles on a canvas. The Pals are just as well suited for this as they are for the React component wrappers this project uses. For the former, though, you'd probably ignore the two files we called out above.
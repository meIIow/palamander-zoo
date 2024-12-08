# Palamander Modules

These modules are a WIP. Currently, this code only renders linear (one child per segment) Palamander with somewhat natural movement.

A Palamander consists of segments arranged in a tree rooted at its head. This might seem like a limitation, but the option space is actually quite large and flexible - different segment trees can result in vastly different body types.

Each segment renders as a circle with its location relative to its parent segment. Most of a segment's data is concerned with the exact relationship of where it should exist with respect to its parent segment. In particular, we care about:
1. Its angle. Should it come out the back of the parent node, creating a straight line of segments? Should it come out a few degrees clockwise? Should this change if the palamander is turning or wiggling? There are several persistent segment values (determined when the segment is initially defined) that help decide these relationships, and some that are based on the current movement state.
2. Its distance relative to the parent segment. Generally a segment is positioned around the spot where it is tangent to its parent - their edges just barely touch. But this can differ based on persistent values (maybe we want closer segments in order to simulate a carapace) or movement (maybe distances can lengthen when speeding up).

Whenever enough time passes and we decide to update our Palamander's location (simulate its movement), we run an update function over the segments that calculates where each segment should be. Each segment's result cannot be statelessly determined (doing this results in jerky, unnatural-looking movement) - it depends on certain segment values from the single update before.
# Palamander Morphology

These modules describe natural palamander structure and movement.

### The Segment Tree

A Palamander consists of segments arranged in a tree rooted at its head. This might seem like a limitation, but the option space is actually quite large and flexible: different segment trees can result in vastly different body types, from jellyfish to newts to "sea monkies".

### Calculating Segment Location
Each segment renders as a circle (of some static radius) centered on a location relative to its parent segment. For a single snapshot of time, this is easy - we just need some trig, the distance from the parent, and the angle off the parent.

The distance from parent to child segment is statically defined based on the look we want for that Palamander part. The angle is a different story: it is dynamic so as to simulate natural behavior in a satisfying way. It depends on a number of considerations:
1. Resting body structure (skeleton) of a Pal. Should a child segment come out the back of the parent node, creating a straight line of segments, like a newt's spine? Should it come out a few a few degrees clockwise or counter-clockwise, like for the first segment of a newt's limb?
2. Response of this segment to movement. Should these parent-child positions be locked (like for a rigid carapace) or bend (like a newt's body) as a a result of angular momentum?
3. Background animations for this structure. Pals seem robotic and stiff without some wriggling, particularly when they are not rotating.

Deriving the angle that captures all these factors is a challenge. We have devised a set of parameters and corresponding update logic that calculate the varaious components of a segment's overall angle. These are outlined in detail in the `Segment` type spec and in [animation](./animation).

### Describing Sets of Segments

The segment parameters that dictate its angle updates are somewhat granular - it wouldn't make sense to have to define many of these directly at the Pal level. Instead we introduce the `Section` type as a uniform way to describe a set of Segments. We `Segementate` a `Section` into its corresponding `Segment` list. See the modules in [segmentation](./animation) for details - the full paradigm and motivation is described in the corresponding README.
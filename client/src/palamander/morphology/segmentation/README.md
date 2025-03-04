# Palamander Segmentation

These modules contain the logic for tranforming high-level Pal components (`Sections`) into `Segments`.

### Motivation for the Segmention Paradigm
`Segments` are the fundamental components of our Pals - but each `Segment` does not exist in a vacuum. They generally have meaningful connections, and possibly shared behavior, with neighboring `Segments`. The `Segments` that form a newt's spine, for example, might share most parameters and contain other parameters that change predictably over some gradient.

It's reasonable, then, to create bundles of heirarchical logic that let us share, tweak and re-use `Segment` configuration. Instead of instantiating each `Segment` of that newt spine individually, we might have a method that loops through to create each one in turn. Underneath the hood here, we could have a more general function that takes more parameters but can create any line of `Segments` with varying behavior - like a swishing fish tail or a curling octopus tentacle.

One could imagine that an add-hoc system like this could be viable - but it seems likely to become messy and unmanagable.

Additionaly, we want to be able to define Pal types as relatively simple JSON configuration that can be managed on a server or in local storage. We could of course store the underlying `Segment` tree as JSON - but what if we decided at some point to slightly tweak one of our Pals? Suddenly we need to update every place where this Pal type is stored with our new definition. Additionally, now anywhere that interacts with this might need to understand all the `Segment` parameter nuances. Yikes.

Finally, we have the eventual goal of being able to make arbitrary Pal "Chimeras" that combine different body types and structures from existing Pals. This code may or may not be written in TypeScript - the current plan is for a Python Backend - so it can't require intricate knowledge of `Segment` details or the sharing of granular helper functions from the TS codebase.

Three criteria have emerged:
1. Impose some sort of organization
2. Facilitate a high-level system for persisting Pal type structure
2. Support language-agnostic, randomly-generated 'Chimera' creation

To check all these boxes, we've imposed a tight structure over the Segmentation code base.


### Section -> (Segmentation) -> Segments

The `Section` abstraction is central to our approach. It is a type that contains the tightest possible description of a Palamander sub-structure. It strikes the balance between
1. Flexibility. One `Section` type can support a family of similar structures, based on the extra fields. We should be able to define both a salamander and axolotl body with the 'next-body' section, even if one might be thicker or longer than the other. We should be able to use the 'frog-leg' section to represent a left or right frog leg. 
2. Specificity. A `Section` should represent some meaningful part of a Palamander, not some generic idea for a set of Segments.
3. Composability. `Sections` can be composed together in predictable ways where appropriate - into pairs (e.g. frog legs), radial sets (starfish arms), etc.

In terms of implementation, each `Section` breaks down into a tree of branched Sub-`Sections` and returned`Segments`. The logic for actually processing this is pretty tight and contained in [segmentate.ts](./segmentate.ts).

Although `Sections` themselves adhere to this strict type set, it is useful to have generic, lower-level functions that describe even more flexible ways of creating sets of `Segments`. This is handled by the [segmentation.ts](./segmentation.ts) module. Many `Sections` configure appropriate parameters and ultimately shell out to the `segmentation.ts` logic to create a granularly-defined lists of segments. That way we can re-use code between `Sections` without convoluting the `Section` type usage by higher-up processes.

# Segmentate Function Details

The top-level `segmentation-map` is formed by combining the `segmentation-maps` from all `segmentate-[x].ts` files. They could all be one giant file, but were broken up based on reasonable `Section` categories for clarity.

A few special `composite` `Sections` represents ways in which other `Sections` can compose together - as Pairs, Radial Sets or Equally-Distributed Sets.

An important distinction exists between `primary` and non-`primary` `Segments`, which determines whether they are considered as part of the center-of-mass calculations. Sub-`Segments` that result in `primary` `Segments` are composed into a `Section` tree via the `next` field, and others via the `branches` field.

### Adding new Pals
All Pal types corresponding to a single top-level `Section` type. 

Defining the structure of a new Pal is as simple as creating a new function in [segmentate-pal.ts](./segmentate-pal.ts) and adding it to that `segmentation-map`. This function will likely recontextualize that top-level section as a tree of sub-sections - although it might require adding new `Sections` or potentially just initializing `Segments` right there.

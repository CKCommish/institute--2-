# What each photograph actually is

All images in `public/media/` are **public domain** (Library of Congress
Carol M. Highsmith Archive, or U.S. federal works). No attribution notice is
required on the rendered site. Full record: `public/media/ATTRIBUTIONS.md`.
Editorial notes and crop reasoning: `CONTENT-NOTES.md`.

**These are real photographs of real places and real people.** The site must
never imply a photograph shows something it does not. That is not a style
preference — a civic institute that mislabels a picture has a credibility
problem, and this is exactly the kind of site where someone will check.

| file | what it actually shows | never imply |
| --- | --- | --- |
| `hero.jpg` | A man and his dog at the Mississippi River at dusk, Greenville, Mississippi | — |
| `forum.jpg` | A harbour at dusk — breakwater, moored sailboats, blue-hour sky — at **Old Harbor, Block Island, Rhode Island** | **that this is Hyannis Port, Cape Cod, or the Kennedy Compound** |
| `institute.jpg` | An empty meeting room: long table, navy walls, American flag | that it is the Institute's own room |
| `pilot-health.jpg` | A young athlete at a Special Olympics **Unified track event** (U.S. Army, Camp Humphreys) | that this is a Healthy Athletes screening, or that it is domestic |
| `pilot-health-portrait.jpg` | The same photograph, cropped to 4:5 | (as above) |
| `pilot-health-track.jpg` | The same photograph, cropped to the 3:1 band at the foot of the frame: a stride, a lane, a track. **This is the file /pilots/ ships.** | (as above) |
| `pilot-energy.jpg` | A high-voltage transmission tower under heavy overcast, **Muskingum County, Ohio** | that this is the Pacific Northwest, Washington, or BPA |
| `pilot-maternal.jpg` | A mother holding her infant at home in the doorway of a **family child care home**, alone in frame | that it is Indianapolis, that it is clinical, or that she is a pilot participant |
| `pilot-education.jpg` | Two students welding in an Oregon public high-school shop class | — |

`pilot-health-track.jpg` is also a **crop, and the crop is the point.**
The Army original is a girl of about seven at a Unified track meet in South
Korea: face fully visible, her school's name legible across her shirt. Until
wave 8 /pilots/ ran it full-bleed at 1440 × 780 under the words *Healthy
Athletes* — a real, identifiable child fronting a Special Olympics programme
she has no relationship to, on a page addressed to funders. The credit under
it was honest and did not undo the impression.

The shipped band is `left 0, top 800, 2400 × 800` of the 2400 × 1600 master:
shorts, legs, shoes, lane lines, the red of the track. No face, no shirt, no
school. The frame is now **about the activity rather than the individual**,
which is what it was always illustrating. The master stays on disk as the
source of the crop and is no longer referenced by any page. If this file is
ever re-cut, cut it from `pilot-health.jpg` and keep the top edge below
y = 800 of 1600 — above that line the shirt graphic starts.

`pilot-maternal.jpg` is a **crop**, and the crop is the point. The USDA original
is a two-person photograph: the mother, and a child care provider she is handing
a bottle of breastmilk to. The provider is a real, identifiable woman with no
relationship to this institute or this pilot, and the earlier crop left her at the
right edge, cut mid-face, beside the words *Infant Mortality*. The shipped file
ends before her at every variant and in every shape the site renders it in. If
this image is ever re-cut, cut it from the original and keep the right edge inside
x = 3860 of 7360.

Its credit follows the rule below like the other three, and it names the frame,
not the rights-holder: **`Family child care home · USDA`**. It used to read
"U.S. Department of Agriculture", which told a reader who owns the picture and
nothing about what it shows — so under a 55px *Infant Mortality* headline the
only line attached to an identifiable private individual was an agency name.
For the same reason this is the one pilot frame that ships real `alt` text
rather than `alt=""`: the others are places and events described by the copy
set on them, this one is a person.

## The second rule, added in wave 8: SCALE IS PART OF THE CLAIM

A photograph of a private individual does not become safer by being made
shorter. /pilots/ tried a full-bleed 16/5.5 band as the fix for the
screen-filling frames, and it made the worst of them worse: cover-cropping a
3:2 photograph of a mother and infant into a 5:1 strip **1440px wide** renders
her face larger than the full-bleed frame did, because the only thing that
changed was how much of her the frame kept. What reduces the claim a
photograph makes about a person is **narrowing the frame**, which reduces both
at once.

So on /pilots/ every pilot photograph is now a plate about one column wide
(~560px at 1440), set beside the copy rather than under it, and no page-level
type is set on any of them. A person in one of these frames is a person in a
room. That is the size these pictures are honest at.

## The rule this creates

A full-bleed photograph with a place-name set over it reads as a caption,
whether or not you meant it as one.

**Do this:** put a small, accurate location credit in a corner of every
full-bleed scene — the same tracked micro-caps used elsewhere, at low contrast.

- `hero.jpg` → `Greenville, Mississippi`
- `forum.jpg` → `Block Island, Rhode Island`
- `institute.jpg` → `Library of Congress`

This is honest, it is what serious editorial sites do, and it adds a layer of
real texture to a corner that is otherwise empty.

## The Forum scene needs one deliberate decision

**Read this before writing the Forum scene.** The Forum photograph changed in
the media second pass. It used to be a house on the beach at Hyannis Port; it is
now a harbour at dusk on Block Island, Rhode Island. The old frame was flat, and
worse, a large private house *at Hyannis Port* under a Forum headline is the most
direct possible invitation to the Kennedy-Compound misreading this file exists to
prevent. The new frame is a much better photograph and carries no such claim —
but it is **not** in the Forum's town, and it is not even in Massachusetts.

So the Forum scene now has two location strings doing two different jobs, and
they must not be allowed to collapse into one:

- **`forum.place` — "Kennedy Compound, Hyannis Port"** describes *the convening*.
  It is a fact about the event and it stays.
- **The photo credit — "Block Island, Rhode Island"** describes *the photograph*.

Set them so a reader cannot mistake one for the other: keep the event line where
it is, in the display stack with the headline, and put the photo credit in a
corner, small, low-contrast, visually a different voice. Do not place the credit
adjacent to the event line, and do not caption the photograph with the event's
location. If that separation cannot be made to work in the layout, drop the photo
credit rather than the event line — the picture makes no claim on its own, and an
unlabelled dusk harbour is honest. What is not acceptable is "Hyannis Port" set
against this photograph as though it described it.

If the Institute ever obtains a released photograph of the actual venue, that
tension disappears and this frame should be swapped out.

## Portraits

`founder-mckelvy.jpg` and `founder-olanoff.jpg` deliberately do not exist. There
is no rights-cleared portrait of either founder and synthetic likenesses of real
people are out of the question. People must be strong without portraits.

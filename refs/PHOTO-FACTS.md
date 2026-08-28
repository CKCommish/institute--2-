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
| `pilot-maternal.jpg` | Downtown **Indianapolis, Indiana** from the air on a hazy afternoon — the Chase Tower and the towers around Monument Circle, low-rise blocks in the near ground, tree canopy out to a flat horizon. **No identifiable person in the frame.** | that it shows a hospital, a clinic, a health system, a neighbourhood the pilot has selected, or anything about the people who live there |
| `pilot-education.jpg` | Two students welding in an Oregon public high-school shop class | — |
| `stake.jpg` | A row of small bungalow and brick houses on a brick street in the **Southside Bricks** neighbourhood of **Huntington, West Virginia**, May 2015. Lawns, a picket fence, a front porch with coats on it, no person anywhere in the frame. | that this is Indianapolis or any pilot's location, that it is a place the Institute works in, that it is anyone's home in particular, or that the porch implies a named family |

> The shipped credit is `Unified track event · Camp Humphreys, Korea`. It was
> `Unified track event · U.S. Army` — the only pilot credit with no location,
> in a column where the other three read Muskingum County, Ohio / Indianapolis,
> Indiana / Adrian, Oregon. In that set, omitting the location IS the
> implication this row forbids: a reader completes the pattern with a U.S.
> place. The event stays in the string because it is the clause that stops the
> frame reading as a Healthy Athletes screening.

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

`pilot-maternal.jpg` was **replaced in wave 9** and the file is no longer a
photograph of a person. The client rejected the previous frame — the USDA
picture of a mother holding her infant in the doorway of a family child care
home — and it is gone from disk, along with the obsolete `pilot-maternal-crop.*`
workaround. Nothing on the site should be written as though that photograph is
still there.

What ships now is Carol M. Highsmith's *Aerial view of Indianapolis, Indiana*
(LC-DIG-highsm-40936, 2016), cropped to 3:2 from the top of the frame. It is a
**place, not a person**, and it is the actual place: pilot 03 is proposed for
Indianapolis. That makes it the fourth Highsmith frame in the set, which is what
holds the photography together as one system.

The credit is therefore a location like the other Highsmith frames —
**`Indianapolis, Indiana`** — and this pilot no longer needs real `alt` text.
It ships `alt=""` like the other three: the frame is a place the surrounding copy
already names, and there is no longer a subject an assistive reader is owed a
description of.

The limits on this frame are limits on what it may be said to depict. It is
downtown, seen from a plane, in September. It is **not** a hospital, a clinic, a
health system, a neighbourhood the pilot has chosen, or a picture of anybody who
lives there. The pilot's *where* line is `Indianapolis.` and the credit says
`Indianapolis, Indiana`; that is the whole of the claim and it happens to be true.

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
- `institute.jpg` → `Dallas, Texas`

**Changed in the last wave, and this is the reason.** The credit here read
`Library of Congress` — the only corner label on the site that was not a
place-name, in a set that otherwise reads Greenville / Block Island /
Huntington / Indianapolis / Muskingum County / Adrian. An archive name is an
attribution, and attribution is not what this label is for: the rule two
paragraphs up says the label exists to stop a headline reading as a caption,
which is a LOCATION job. It also failed the one thing this file says
`institute.jpg` must never imply. Under "We sit between the builders and the
institutions" and under "Sixteen put forward", `Library of Congress` does
nothing to stop a reader taking the room for the Institute's own; `Dallas,
Texas` does, in two words, because the Institute is not in Dallas. The
location is from `public/media/ATTRIBUTIONS.md`: the Tower Building at Fair
Park, Dallas, Texas (LC-DIG-highsm-30117). No attribution is legally required
on any frame in this set — ATTRIBUTIONS.md is the legal record — so nothing is
lost by making this label do the same job as the other six.

This is honest, it is what serious editorial sites do, and it adds a layer of
real texture to a corner that is otherwise empty.

### The homepage credit was being painted out by the scene's own ink (wave 16)

The rule above only works if the label can be READ. On the homepage's held
Forum scene it could not: `BLOCK ISLAND, RHODE ISLAND` measured **1.06 : 1 at
390px and 1.98 : 1 at 1440px with motion, 1.79 / 2.28 : 1 under
`prefers-reduced-motion: reduce` and with JavaScript off** — swept across the
whole hold, glyph pixels differenced against the same pixels with the glyphs
made transparent, so every painted layer stayed in place. At that contrast the
photograph asserts, in pixels, that it is the Kennedy Compound named three
lines below it.

**The cause was paint order, not weight, and that is the part worth keeping.**
Every wave that looked at this reached for more ink — `.held__cap` exists
because of an earlier one — and more ink made it worse. `HeldScene`'s whole
grade stack (the arc sheet, the bar cap, the foot) was a SIBLING of the figure,
and `Figure` sets `isolation: isolate`, so nothing outside it can ever paint
beneath a layer inside it. The scene's ink was landing on top of the credit.
Measured, the ground under those glyphs was already at 0.006 relative
luminance — deep — while the cream ink read 0.039–0.079 against the 0.60 the
same string reads on `/forum/`. The ink was darkening the disclaimer and its
backdrop in the same proportion, which no amount of it can fix.

`Figure` now has a `grade` slot rendered above its grain and below its credit,
and `HeldScene` hands its grade stack to it. Nothing about the ink's weight,
height, position or timing changed — only the order. A full-page pixel diff of
the homepage before against after, in all three render modes at 1440x900 and
390x844, changes **no pixel outside the credit's own 230x10 box**; the eyebrow
`By invitation`, the site's calibration string, is bit-identical and its
4.563 : 1 stands untouched.

After: the same credit reads **7.68–11.80 : 1** at the settled offsets and its
worst reading anywhere in the hold is **4.66 : 1** (390px, mid-arc), against
the 4.5 budget.

**All ten corner credits were then measured the same way** — three render
modes (motion, `reduce`, no-JS) x two viewports — because they are all
disclaimers of the same kind. The other nine were already sound and are
unchanged: the worst of them is `Huntington, West Virginia` at 6.01 : 1 on a
390px viewport, and the rest sit between 7.3 and 12.7 : 1. Only the held scene
had the defect, and only because only the held scene paints its own ink over
its own figure.

If a credit ever measures thin again, **check paint order before opacity.**

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

### What was done about it, and why position alone was not enough (wave 12)

The remedy above was written as a POSITIONAL one — event line in the display
stack, credit in a corner, two registers — and for eleven waves the site
believed it had applied it. It had not. On `/forum/` the event line had drifted
out of the display stack into the left end of the masthead's foot band: 24-27px
cream, alone in the bottom-left corner of a full-bleed photograph of Block
Island, with the true credit small and dim in the opposite corner. That is the
canonical caption position, and the wave-11 blind read named it. The homepage
held scene had the line in the right place and still printed both strings in one
frame, the big one reading as the caption.

Two changes, and the second is the one that lasts:

1. **`/forum/` now applies the remedy as written.** `src/pages/forum.astro`:
   the event line sits inside `.fh__lock`, under the `<h1>`, ranged with the
   name. The foot band keeps the eyebrow, the rule and the cue. This spent
   half of that masthead's named arrangement — the two location strings in
   diagonally opposite corners — on purpose, because the diagonal was the
   defect. The other half, the name hung off the right rail in the empty half
   of the frame, is untouched.

2. **The string itself stopped being a bare place-name.** `forum.place` in
   `src/data/site.js` read `Kennedy Compound, Hyannis Port` and now reads
   **`Held at the Kennedy Compound, Hyannis Port`**. Sourced to the
   prospectus: "The Lion Forum is an invitation-only convening held at the
   historic Kennedy Compound in Hyannis Port, Massachusetts." A clause with a
   verb is a statement about the EVENT and cannot be read as a caption for a
   photograph, in any corner, at any size, on any viewport. Position and
   register still help; they are no longer carrying the claim by themselves.

The rule this adds to the one above: **a place-name set on a photograph is
kept honest by its grammar before it is kept honest by its position.** If a
layout ever needs the event line somewhere else, the string survives the move.

### The credit's POSITION was still wrong after wave 16 fixed its contrast (wave 17)

Wave 16 took this credit from 1.06 : 1 to 8.44 : 1 by paint order. It was
still leaving the screen after 36 pixels of scroll.

Measured on the shipped tree, `/forum/` masthead, both viewports:

| | credit's box | fixed bar | fully swallowed at | claim gone at |
|---|---|---|---|---|
| 1440x900 | y 90.4–102.0 | 63.4px | **38.7px of scroll** | 750px |
| 390x844  | y 83.3–114.1 | 58px    | **56px of scroll**   | 700px |

The credit was anchored to the TOP of a 100svh frame and never returned. The
event line — `Held at the Kennedy Compound, Hyannis Port` — is at the FOOT of
the same frame and stays for another seven hundred pixels. So for all but the
first ~5% of the time a reader looked at this photograph, the claim was on
screen and the disclaimer was not. A disclaimer with a shorter life than the
claim it qualifies is not a disclaimer.

**The corner was not the problem and moving it does not fix it.** All three
other corners are taken — bottom-left is the invitation line, bottom-right is
the Scroll cue — and both bottom corners lie on the event line's own band,
which the section above forbids the credit from joining. On a 390px viewport
the masthead is a single column, so *every* bottom placement is directly
adjacent to the event line. The defect was DURATION.

So `Figure` grew `creditHold`: the credit renders as a sticky sibling of the
figure rather than an absolute child of it, and holds its position under the
bar while the photograph scrolls past. (It has to be a sibling — `.fig` sets
`overflow: hidden` and is therefore its own scroll container, and a sticky
element inside one never moves.) `creditClear` is the second half: the length
at which it stops holding and rides out, measured off the scene's own display
block, so the credit yields BEFORE it can meet the event line rather than
crossing it.

Measured after, `/forum/` with `creditClear="11.5rem"`:

- credit fully occluded at scrollY **670** (desktop) / **610** (mobile);
  claim fully occluded at 750 / 700. The disclaimer is now on screen for
  **89% / 87%** of the claim's life, against 5% / 8% before.
- closest the two strings ever come: **54px** (desktop) / **46px** (mobile),
  against the 25.6px the masthead already sets between the event line and its
  own eyebrow. They approach; they never cross.
- at scroll 0 the credit lands on the same pixels it always did. A
  full-viewport pixel diff of the page before against after, at 1440x900 and
  390x844 under `prefers-reduced-motion: reduce`, differs by **zero pixels**;
  the box is unchanged in all three render modes with JavaScript on and off
  (sticky is CSS, so no render mode can lose it). The arrangement is
  untouched. Nothing further was spent out of the masthead that wave 12 half
  spent already.
- contrast across the whole hold, by subtraction at 3x: worst **9.66 : 1**
  (desktop, scrollY 260) and **10.56 : 1** (mobile). Riding down the picture
  costs it nothing, because the wash travels with the glyphs.

The remaining ~11% is real and is stated here so nobody thinks it is closed:
in the last ~80px of the hero's scroll the event line is still on screen and
the credit has gone. Closing it completely means giving the credit the
bottom-left corner, which means moving `By invitation` out of the foot band —
a second bite out of this masthead's arrangement, and not worth it for the
tail of a scroll on which the claim itself is sliding under the bar. When the
client's own photographs land, `forum.jpg` comes off the site and the whole
question goes with it.

**When the client's Kennedy Compound photographs land**, none of this has to
be undone. `forum.place` is true of the convening either way and stays as it
is; `forum.photos.lawn` already carries its own credit (`Hyannis Port,
Massachusetts`), and on that day the two strings agree and the corner label
stops being a disambiguation and becomes a plain location. What comes off the
site then is `forum.jpg` itself, per the section below — not this wording.

Every other photograph on the site was walked for the same arrangement. There
is no other display-sized place-name set over a photograph anywhere: all seven
corner labels are in the credit register, and the only other place-name near a
frame is pilot 03's `where: 'Indianapolis.'`, which sits in the copy column
beside its plate, not on it, and is the photograph's true location regardless.


## Client-owned photography

The Lion Forum photographs are owned by the Institute. **They carry no
attribution credit.** That is settled — do not add a photographer line to them.

This splits what the corner label has been doing into its two separate jobs:

- **Attribution** — required for the Library of Congress frames, not for these.
- **Location** — an editorial fact that stops a place-name headline reading as
  a caption for a photograph taken somewhere else. That is why the label exists
  at all: the Forum scene once set "Kennedy Compound, Hyannis Port" over a
  Rhode Island harbour.

So an owned photograph may still carry a corner label, and should where it
disambiguates a place. A Lion Forum stage frame needs none — the branded
backdrop says where it is. A Hyannis Port lawn at dusk earns one, because that
is the claim the page has been unable to make with a stand-in.

**When the real Forum photographs land, `forum.jpg` (Old Harbor, Block Island)
stops being needed.** It was an honest stand-in for a place we had no picture
of. Remove it rather than keeping it as decoration.

## Portraits

`founder-mckelvy.jpg` and `founder-olanoff.jpg` deliberately do not exist. There
is no rights-cleared portrait of either founder and synthetic likenesses of real
people are out of the question. People must be strong without portraits.

## Resolved: the homepage Stake no longer shares pilot 03's file

`pilot-maternal.jpg` used to be used in two places — pilot 03's plate on
`/pilots/` and the full-bleed Stake scene on the homepage. That is why the
wave-9 replacement changed the picture under both and left the Stake's strings
describing a photograph that was no longer on disk.

That is closed. The Stake has its own `image`, its own credit, and its own
photograph; `pilot-maternal.jpg` is referenced by /pilots/ alone. The Stake's
credit is `Huntington, West Virginia` and its `alt` is `''`. See the section at
the foot of this file for what the new frame is and what may be said about it.


## The Stake scene has its own photograph now (added after wave 9)

The homepage Stake — `src/components/scroll-Stake-alt.astro`, fed by `stake` in
`src/data/site.js` — used to SHARE pilot 03's file. That is why replacing pilot
03's picture silently changed the homepage, and why the Stake was left setting
*"The test is ordinary life."* at 86px over an aerial photograph of downtown
Indianapolis: a business district under a line about domestic, everyday life.
The two are decoupled: the Stake reads `/media/stake.jpg`, which is its own
file and is not referenced by any other page.

What ships is Carol M. Highsmith's **LC-DIG-highsm-31738** (2015-05-07):
*"Similarly designed small bungalow homes on one of several brick streets in a
neighborhood of Huntington, West Virginia…"* — the neighbourhood is known
locally as the **Southside Bricks**. Public domain, Highsmith Archive, "No
known restrictions on publication." It is the **fifth Highsmith frame** in the
set, which is what keeps seven photographs from seven places reading as one
commission.

Three things make it the right frame for this scene specifically, and they are
the things to preserve if it is ever recut:

1. **It means what the line means.** Modest houses, mown grass, a picket fence,
   a porch with coats hanging on it, a brick street. Nothing aspirational,
   nothing affluent, no landmark, no skyline.
2. **There is no person in it.** Not a person at distance, not a person out of
   focus — nobody. The porch implies a household without exposing one, which
   is the strongest form this frame can take on a site where six critics have
   already flagged real individuals being used without their agreement. Any
   replacement crop must keep that true across the WHOLE scroll of the scene,
   not just at one offset.
3. **The bottom-right is quiet.** The scene sets three lines of 86px serif
   ranged RIGHT at the FOOT of a 108svh frame, so the region that has to stay
   calm is the bottom-right, not the right half generally. Here that region is
   lawn, hedge and kerb — one tone, no detail, and the bottom-left-scrim
   mirrored to the right (`align="right"`) lands its ink exactly there.

The file on disk is the **full frame** at 2400 × 1600, neutral, with no colour
grade baked in — the site applies its own. Tighter crops of the same negative
were rendered under the real treatment and all of them lose the brick street
and the sweep of the kerb, which is what makes the frame read as a street
somebody lives on rather than a row of house fronts.

The credit is a location, like the other Highsmith frames:
**`Huntington, West Virginia`**. It says where the photograph was taken. It is
not a claim that the Institute works there. `alt` stays `''`: the scene's
sentence is the content and there is no subject an assistive reader is owed a
description of.

## Pending arrival — the client's own Lion Forum photographs

These six have been shown to me in the conversation but have never arrived as
files. Pasted images reach the model as pictures, not as files on disk; only
a real attachment lands in the uploads folder, which is why the sixteen board
headshots got here (they were inside `Prospectus_document_review.zip`) and
these have not. Recorded here from looking at them, so that whoever imports
them is not guessing at captions afterwards, and so no caption is authored
from the slot name.

Describe only what is visible in the frame. Nothing below is sourced from
either document; none of it may become a claim about the Institute.

| slot | what the frame actually shows |
|---|---|
| `stage` | Two men in armchairs on a low stage, glass side table with two water bottles between them. Backdrop is a large blue screen carrying the repeated LION FORUM wordmark over a pale line-drawing of a domed/columned building. One man is laughing; the other is mid-gesture. A plant is out of focus in the foreground. |
| `podium` | Two men seated in armchairs, one in a grey jacket with his back three-quarters to camera, one in navy. The screen behind carries a headshot and the line "Head of Healthcare, Anthropic". An American flag is blurred across the left foreground. |
| `notebook` | A woman speaking, pen in hand, an open notebook on her lap; the interviewer's back is to the camera in the left foreground. Same blue LION FORUM backdrop with the columned-building graphic. |
| `reception` | An outdoor reception at golden hour under an open blue sky. A crowd in LION FORUM lanyards. In the foreground a man whose badge reads ANEESH CHOPRA is talking with a white-haired man in glasses. **Aneesh Chopra is on the prospective board list** — if this frame is used anywhere near the roster, the site must not let it imply he has accepted a seat. |
| `lawn` | A woman in a pale blue dress, back to camera, standing on mown grass looking out at a harbour full of moored sailboats. A clipped hedge at the left, a path curving in at the right, low sun casting a long shadow. This is the frame intended to replace the Block Island stand-in. |
| `founders` | The two founders in an office: one seated on a desk in a white shirt, one standing in a navy suit. On the wall, a framed newspaper front page — THE SUN, "Kennedy Holds Strong Lead Over Nixon". A small US flag in a desk tidy, grey filing cabinets, a glass partition and city window behind. |

**The one rule that matters when they land.** Do not caption any of these with
a place name unless the place is known. The lawn frame is the only one that
may plausibly carry "Hyannis Port, Massachusetts", and only if the client
confirms it — a harbour of moored boats is not self-identifying, which is the
whole reason this file exists. Until then a credit that names no place is
correct and a credit that guesses one is the exact defect this document was
written to prevent.
